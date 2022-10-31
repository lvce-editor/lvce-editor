import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Css from '../Css/Css.js'
import { CancelationError } from '../Errors/CancelationError.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const state = {
  pendingModules: Object.create(null),
}

const ViewletState = {
  Default: 0,
  ModuleLoaded: 1,
  ContentLoaded: 2,
  RendererProcessViewletLoaded: 3,
  ContentRendered: 4,
  Appended: 5,
}

const kCreate = 'Viewlet.create'
const kAppend = 'Viewlet.append'
const kSendMultiple = 'Viewlet.sendMultiple'
const kLoadModule = 'Viewlet.loadModule'
const kLoad = 'Viewlet.load'
const kSetBounds = 'Viewlet.setBounds'
const kAppendViewlet = 'Viewlet.appendViewlet'
const kHandleError = 'Viewlet.handleError'
const kDispose = 'Viewlet.dispose'

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
        /* Viewlet.sendMultiple */ kSendMultiple,
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
    await RendererProcess.invoke(
      /* Viewlet.sendMultiple */ kSendMultiple,
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
  if (module.render) {
    return module.render(oldState, newState)
  }
  return []
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

const maybeRegisterEvents = (module) => {
  if (module.Events) {
    // TODO remove event listeners when viewlet is disposed
    for (const [key, value] of Object.entries(module.Events)) {
      const handleUpdate = async () => {
        const instance = ViewletStates.getInstance(module.name)
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
          /* Viewlet.sendMultiple */ kSendMultiple,
          /* commands */ commands
        )
      }
      GlobalEventBus.addListener(key, handleUpdate)
    }
  }
}

const actuallyLoadModule = async (getModule, id) => {
  const module = await getModule(id)
  await RendererProcess.invoke(/* Viewlet.load */ kLoadModule, /* id */ id)
  if (module.Css) {
    // this is a memory leak but it is not too important
    // because javascript modules also cannot be unloaded
    await Css.loadCssStyleSheet(module.Css)
  }
  maybeRegisterWrappedCommands(module)
  maybeRegisterEvents(module)
  return module
}

const loadModule = (getModule, id) => {
  if (!(id in state.pendingModules)) {
    state.pendingModules[id] = actuallyLoadModule(getModule, id)
  }
  return state.pendingModules[id]
}

// TODO add lots of unit tests for this

export const backgroundLoad = async ({
  getModule,
  id,
  left,
  top,
  width,
  height,
  props,
}) => {
  const module = await loadModule(getModule, id)
  const viewletState = module.create(id, '', top, left, width, height)
  const { title, uri } = await module.backgroundLoadContent(viewletState, props)
  return {
    title,
    uri,
  }
}
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

    module = await loadModule(viewlet.getModule, viewlet.id)
    if (viewlet.disposed) {
      return
    }
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
    if (
      (viewlet.visible === undefined || viewlet.visible === true) &&
      module.show
    ) {
      await module.show(newState)
    }
    const extraCommands = []

    if (module.getChildren) {
      const children = module.getChildren(newState)
      for (const child of children) {
        const childModule = await loadModule(viewlet.getModule, child.id)
        // TODO get position of child module
        const oldState = childModule.create(
          '',
          '',
          child.left,
          child.top,
          child.width,
          child.height
        )
        let instanceSavedState
        if (restore) {
          const stateToSave = await SaveState.getSavedState()
          instanceSavedState = getInstanceSavedState(stateToSave, child.id)
        } else if (restoreState) {
          instanceSavedState = restoreState
        }
        const newState = await childModule.loadContent(
          oldState,
          instanceSavedState
        )
        const childInstance = {
          state: newState,
          factory: childModule,
        }
        ViewletStates.set(childModule.name, childInstance)
        const commands = getRenderCommands(childModule, oldState, newState)
        extraCommands.push([kCreate, childModule.name])
        extraCommands.push(...commands)
        extraCommands.push([kAppend, viewlet.id, childModule.name])
        if (childModule.contentLoadedEffects) {
          await childModule.contentLoadedEffects(newState)
        }
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
    } else {
      await RendererProcess.invoke(
        /* Viewlet.load */ kLoad,
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
    const commands = [[kCreate, viewlet.id]]
    if (viewletState !== newState && module.contentLoaded) {
      const additionalExtraCommands = await module.contentLoaded(newState)
      Assert.array(additionalExtraCommands)
      commands.push(...additionalExtraCommands)
    }

    if (module.hasFunctionalRender) {
      const renderCommands = getRenderCommands(module, viewletState, newState)
      commands.push(...renderCommands)
      if (viewlet.show === false) {
        const allCommands = [
          ...commands,
          ...extraCommands,
          // ['Viewlet.show', viewlet.id],
        ]
        if (viewlet.setBounds !== false) {
          allCommands.splice(1, 0, [
            kSetBounds,
            viewlet.id,
            left,
            top,
            width,
            height,
          ])
        }
        if (module.contentLoadedEffects) {
          module.contentLoadedEffects(newState)
        }
        return allCommands
      }
      // console.log('else', viewlet.id, { commands })
      commands.push(...extraCommands)
      await RendererProcess.invoke(
        /* Viewlet.sendMultiple */ kSendMultiple,
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
    if (viewlet.parentId && viewlet.show !== false) {
      await RendererProcess.invoke(
        /* Viewlet.append */ kAppendViewlet,
        /* parentId */ viewlet.parentId,
        /* id */ viewlet.id,
        /* focus */ focus
      )
    }
    state = ViewletState.Appended

    if (viewlet.disposed) {
      // TODO unload the module from renderer process
      return
    }
    return commands
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
      const commands = []
      if (state < ViewletState.RendererProcessViewletLoaded) {
        await RendererProcess.invoke(
          /* Viewlet.load */ kLoad,
          /* id */ viewlet.id
        )
      }
      commands.push([kCreate, viewlet.id])
      if (state < ViewletState.Appended && viewlet.parentId) {
        commands.push([
          /* Viewlet.append */ kAppendViewlet,
          /* parentId */ viewlet.parentId,
          /* id */ viewlet.id,
        ])
      }
      commands.push([
        /* viewlet.handleError */ kHandleError,
        /* id */ viewlet.id,
        /* parentId */ viewlet.parentId,
        /* message */ `${error}`,
      ])
      return commands
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
  await RendererProcess.invoke(/* Viewlet.dispose */ kDispose, /* id */ id)
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
