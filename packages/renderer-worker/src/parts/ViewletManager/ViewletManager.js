import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import { CancelationError } from '../Errors/CancelationError.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const ViewletState = {
  Default: 0,
  ModuleLoaded: 1,
  ContentLoaded: 2,
  RendererProcessViewletLoaded: 3,
  ContentRendered: 4,
  Appended: 5,
}

// TODO maybe wrapViewletCommand should accept module instead of id string
// then check if instance.factory matches module -> only compare reference (int) instead of string
// should be faster
const wrapViewletCommand = (id, fn) => {
  const wrappedViewletCommand = async (...args) => {
    // TODO get actual focused instance
    const activeInstance = ViewletStates.getInstance(id)
    if (!activeInstance) {
      console.info(
        `cannot execute viewlet command ${id}.${fn.name}: no active instance for ${id}`
      )
      return
    }
    if (activeInstance.factory && activeInstance.factory.hasFunctionalRender) {
      const oldState = activeInstance.state
      const newState = await fn(oldState, ...args)
      if (!newState) {
        console.log({ fn })
      }
      Assert.object(newState)
      // console.log({ fn, newState })
      if (oldState === newState) {
        return
      }
      const commands = render(activeInstance.factory, oldState, newState)
      ViewletStates.setState(id, newState)
      await RendererProcess.invoke(
        /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
        /* commands */ commands
      )
    } else {
      return fn(activeInstance.state, ...args)
    }
  }
  NameAnonymousFunction.nameAnonymousFunction(wrappedViewletCommand, fn.name)
  return wrappedViewletCommand
}

const wrapViewletCommandWithSideEffect = (id, fn) => {
  const wrappedViewletCommand = async (...args) => {
    // TODO get actual focused instance
    const activeInstance = ViewletStates.getInstance(id)
    if (!activeInstance) {
      console.info(
        `cannot execute viewlet command ${id}.${fn.name}: no active instance for ${id}`
      )
      return
    }
    const oldState = activeInstance.state
    const { newState, commands } = await fn(oldState, ...args)
    Assert.object(newState)
    // console.log({ fn, newState })
    if (oldState !== newState) {
      commands.push(...render(activeInstance.factory, oldState, newState))
      ViewletStates.setState(id, newState)
    }
    console.log({ commands })
    await RendererProcess.invoke(
      /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
      /* commands */ commands
    )
  }
  NameAnonymousFunction.nameAnonymousFunction(wrappedViewletCommand, fn.name)
  return wrappedViewletCommand
}

/**
 *
 * @param {()=>any} getModule
 * @returns
 */
export const create = (
  getModule,
  id,
  parentId,
  uri,
  left,
  top,
  width,
  height
) => {
  Assert.fn(getModule)
  Assert.string(id)
  Assert.string(parentId)
  Assert.string(uri)
  Assert.number(left)
  Assert.number(top)
  Assert.number(width)
  Assert.number(height)
  return {
    type: 0,
    getModule,
    id,
    parentId,
    uri,
    left,
    top,
    width,
    height,
  }
}

const getInstanceSavedState = (savedState, id) => {
  if (savedState && savedState.instances && savedState.instances[id]) {
    return savedState.instances[id]
  }
  return undefined
}

const getRenderCommands = (module, oldState, newState) => {
  if (Array.isArray(module.render)) {
    const commands = []
    for (const item of module.render) {
      if (!item.isEqual(oldState, newState)) {
        commands.push(item.apply(oldState, newState))
      }
    }
    return commands
  }
  return module.render(oldState, newState)
}

const maybeRegisterWrappedCommands = (module) => {
  if (module.Commands) {
    for (const [key, value] of Object.entries(module.Commands)) {
      const wrappedCommand = wrapViewletCommand(module.name, value)
      Command.register(key, wrappedCommand)
    }
  }
  if (module.CommandsWithSideEffects) {
    for (const [key, value] of Object.entries(module.CommandsWithSideEffects)) {
      const wrappedCommand = wrapViewletCommandWithSideEffect(
        module.name,
        value
      )
      Command.register(key, wrappedCommand)
    }
  }
}

// TODO add lots of unit tests for this
/**
 *
 * @param {{getModule:()=>any, type:number, id:string, disposed:boolean }} viewlet
 * @returns
 */
export const load = async (
  viewlet,
  focus = false,
  restore = false,
  restoreState = undefined
) => {
  // console.time(`load/${viewlet.id}`)
  if (viewlet.type !== 0) {
    console.log('viewlet must be empty')
    throw new Error('viewlet must be empty')
  }
  let state = ViewletState.Default
  let module
  try {
    viewlet.type = 1
    if (viewlet.disposed) {
      return
    }

    module = await viewlet.getModule(viewlet.id)
    if (viewlet.disposed) {
      return
    }
    maybeRegisterWrappedCommands(module)
    state = ViewletState.ModuleLoaded

    let left = viewlet.left
    let top = viewlet.top
    let width = viewlet.width
    let height = viewlet.height
    if (module.getPosition) {
      const position = module.getPosition()
      left = position.left
      top = position.top
      width = position.width
      height = position.height
    }

    const viewletState = module.create(
      viewlet.id,
      viewlet.uri,
      left,
      top,
      width,
      height
    )

    const oldVersion =
      viewletState.version === undefined ? undefined : ++viewletState.version
    let instanceSavedState
    if (restore) {
      const stateToSave = await SaveState.getSavedState()
      instanceSavedState = getInstanceSavedState(stateToSave, viewlet.id)
    } else if (restoreState) {
      instanceSavedState = restoreState
    }
    let newState = await module.loadContent(viewletState, instanceSavedState)

    const extraCommands = []

    if (module.getChildren) {
      const children = module.getChildren(newState)
      for (const child of children) {
        const childModule = await viewlet.getModule(child.id)
        await RendererProcess.invoke(
          /* Viewlet.load */ 'Viewlet.loadModule',
          /* id */ child.id
        )
        maybeRegisterWrappedCommands(childModule)
        // TODO get position of child module
        const oldState = childModule.create(
          '',
          '',
          child.left,
          child.top,
          child.width,
          child.height
        )
        const newState = await childModule.loadContent(oldState)
        const childInstance = {
          state: newState,
          factory: childModule,
        }
        ViewletStates.set(childModule.name, childInstance)
        const commands = getRenderCommands(childModule, oldState, newState)
        extraCommands.push(['Viewlet.create', childModule.name])
        extraCommands.push(...commands)
        extraCommands.push(['Viewlet.append', viewlet.id, childModule.name])
      }
    }
    if (focus && module.focus) {
      newState = await module.focus(newState)
    }
    if (viewletState.version !== oldVersion) {
      newState = viewletState
      console.log('version mismatch')
      // TODO not sure if Object.assign is a good idea
      // Object.assign(viewletState, newState)
    }
    if (viewlet.disposed) {
      return
    }
    state = ViewletState.ContentLoaded

    if (viewlet.show === false) {
      await RendererProcess.invoke(
        /* Viewlet.load */ 'Viewlet.loadModule',
        /* id */ viewlet.id
      )
    } else {
      await RendererProcess.invoke(
        /* Viewlet.load */ 'Viewlet.load',
        /* id */ viewlet.id
      )
    }
    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    // TODO race condition: viewlet state may have been updated again in the mean time
    state = ViewletState.RendererProcessViewletLoaded

    outer: if (module.shouldApplyNewState) {
      for (let i = 0; i < 2; i++) {
        if (module.shouldApplyNewState(newState)) {
          ViewletStates.set(viewlet.id, {
            state: newState,
            factory: module,
          })
          break outer
        }
        newState = await module.loadContent(viewletState)
      }
      throw new Error('viewlet could not be updated')
    } else {
      ViewletStates.set(viewlet.id, {
        state: newState,
        factory: module,
      })
    }

    if (viewletState !== newState && module.contentLoaded) {
      await module.contentLoaded(newState)
    }

    if (module.hasFunctionalRender) {
      const commands = getRenderCommands(module, viewletState, newState)
      if (viewlet.show === false) {
        const allCommands = [
          ['Viewlet.create', viewlet.id],
          ...commands,
          ...extraCommands,
          // ['Viewlet.show', viewlet.id],
        ]
        allCommands.splice(1, 0, [
          'Viewlet.setBounds',
          viewlet.id,
          left,
          top,
          width,
          height,
        ])
        return allCommands
      }
      // console.log('else', viewlet.id, { commands })
      commands.push(...extraCommands)
      await RendererProcess.invoke(
        /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
        /* commands */ commands
      )
    }

    if (module.contentLoadedEffects) {
      module.contentLoadedEffects(newState)
    }
    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    state = ViewletState.ContentRendered
    if (viewlet.parentId) {
      await RendererProcess.invoke(
        /* Viewlet.append */ 'Viewlet.appendViewlet',
        /* parentId */ viewlet.parentId,
        /* id */ viewlet.id,
        /* focus */ focus
      )
    }
    state = ViewletState.Appended

    // TODO race condition
    // outer: if (module.shouldApplyNewState) {
    //   for (let i = 0; i < 2; i++) {
    //     if (module.shouldApplyNewState(newState)) {
    //       Viewlet.state.instances[viewlet.id] = {
    //         state: newState,
    //         factory: module,
    //       }
    //       break outer
    //     }
    //     newState = await module.loadContent(viewletState)
    //   }
    //   throw new Error('viewlet could not be updated')
    // }

    if (module.events) {
      // TODO remove event listeners when viewlet is disposed
      for (const [key, value] of Object.entries(module.events)) {
        const handleUpdate = async () => {
          const instance = ViewletStates.getInstance(viewlet.id)
          const newState = await value(instance.state)
          if (!newState) {
            throw new Error('newState must be defined')
          }
          if (!module.shouldApplyNewState(newState)) {
            console.log('[viewlet manager] return', newState)

            return
          }
          const commands = render(instance.factory, instance.state, newState)
          instance.state = newState
          await RendererProcess.invoke(
            /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
            /* commands */ commands
          )
        }
        GlobalEventBus.addListener(key, handleUpdate)
      }
    }

    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
  } catch (error) {
    if (error && error instanceof CancelationError) {
      return
    }
    viewlet.type = 4
    console.error(error)
    try {
      if (module && module.handleError) {
        return await module.handleError(error)
      }
      if (state < ViewletState.RendererProcessViewletLoaded) {
        await RendererProcess.invoke(
          /* Viewlet.load */ 'Viewlet.load',
          /* id */ viewlet.id
        )
      }
      if (state < ViewletState.Appended && viewlet.parentId) {
        await RendererProcess.invoke(
          /* Viewlet.append */ 'Viewlet.appendViewlet',
          /* parentId */ viewlet.parentId,
          /* id */ viewlet.id
        )
      }
      await RendererProcess.invoke(
        /* viewlet.handleError */ 'Viewlet.handleError',
        /* id */ viewlet.id,
        /* parentId */ viewlet.parentId,
        /* message */ `${error}`
      )
    } catch (error) {
      console.error(error)
      // this is really bad
      // probably can only show an alert at this point
    }
  }
  // console.timeEnd(`load/${viewlet.id}`)
}

export const dispose = async (id) => {
  state[id].disposed = true
  delete Viewlet.state.instances[id]
  delete state[id]
  await RendererProcess.invoke(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ id
  )
}

export const mutate = async (id, fn) => {
  // TODO handle race conditions here
  const viewletState = state[id]
  await fn(state)
}

export const render = (module, oldState, newState) => {
  if (Array.isArray(module.render)) {
    const commands = []
    for (const item of module.render) {
      if (!item.isEqual(oldState, newState)) {
        commands.push(item.apply(oldState, newState))
      }
    }
    return commands
  }
  return module.render(oldState, newState)
}
