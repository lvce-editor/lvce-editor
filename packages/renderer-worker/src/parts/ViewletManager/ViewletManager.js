import * as Assert from '../Assert/Assert.js'
import * as Command from '../Command/Command.js'
import * as Css from '../Css/Css.js'
import { CancelationError } from '../Errors/CancelationError.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as SaveState from '../SaveState/SaveState.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Id from '../Id/Id.js'

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

const runFn = async (instance, id, key, fn, args) => {
  if (!instance) {
    console.info(`cannot execute viewlet command ${id}.${key}: no active instance for ${id}`)
    return
  }
  if (instance.factory && instance.factory.hasFunctionalRender) {
    const oldState = instance.state
    const newState = await fn(oldState, ...args)
    if (!newState) {
      console.log({ fn })
    }
    Assert.object(newState)
    // console.log({ fn, newState })
    if (oldState === newState) {
      return
    }
    const commands = render(instance.factory, oldState, newState, newState.uid || id)
    ViewletStates.setState(id, newState)
    await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
  } else {
    return fn(instance.state, ...args)
  }
}

const runFnWithSideEffect = async (instance, id, key, fn, ...args) => {
  if (!instance) {
    console.info(`cannot execute viewlet command ${id}.${key}: no active instance for ${id}`)
    return
  }
  const oldState = instance.state
  const result = await fn(oldState, ...args)
  const { newState, commands } = result
  Assert.object(newState)
  // console.log({ fn, newState })
  if (oldState !== newState) {
    commands.push(...render(instance.factory, oldState, newState))
    ViewletStates.setState(id, newState)
  }
  if (commands.length === 0) {
    return
  }
  await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
}

// TODO maybe wrapViewletCommand should accept module instead of id string
// then check if instance.factory matches module -> only compare reference (int) instead of string
// should be faster
const wrapViewletCommand = (id, key, fn) => {
  Assert.string(id)
  Assert.fn(fn)
  const wrappedViewletCommand = async (...args) => {
    // TODO get actual focused instance
    const activeInstance = ViewletStates.getInstance(id)
    await runFn(activeInstance, id, key, fn, args)
  }
  NameAnonymousFunction.nameAnonymousFunction(wrappedViewletCommand, `${id}/${key}`)
  return wrappedViewletCommand
}

const wrapViewletCommandWithSideEffect = (id, key, fn) => {
  const wrappedViewletCommand = async (...args) => {
    // TODO get actual focused instance
    const activeInstance = ViewletStates.getInstance(id)
    await runFnWithSideEffect(activeInstance, id, key, fn, ...args)
  }
  NameAnonymousFunction.nameAnonymousFunction(wrappedViewletCommand, key)
  return wrappedViewletCommand
}

const wrapViewletCommandLazy = (id, key, importFn) => {
  const lazyCommand = async (...args) => {
    const module = await importFn()
    const fn = module[key]
    if (typeof fn !== 'function') {
      throw new Error(`${id}.${key} is not a function`)
    }
    const activeInstance = ViewletStates.getInstance(id)
    await runFn(activeInstance, id, key, fn, args)
  }
  NameAnonymousFunction.nameAnonymousFunction(lazyCommand, `${id}/lazy/${key}`)
  return lazyCommand
}

const wrapViewletCommandWithSideEffectLazy = (id, key, importFn) => {
  const lazyCommand = async (...args) => {
    const module = await importFn()
    const fn = module[key]
    if (typeof fn !== 'function') {
      throw new Error(`${id}.${key} is not a function`)
    }
    const activeInstance = ViewletStates.getInstance(id)
    await runFnWithSideEffect(activeInstance, id, key, fn, ...args)
  }
  NameAnonymousFunction.nameAnonymousFunction(lazyCommand, `${id}/lazy/${key}`)
  return lazyCommand
}
/**
 *
 * @param {()=>any} getModule
 * @returns
 */
export const create = (getModule, id, parentId, uri, x, y, width, height) => {
  Assert.fn(getModule)
  Assert.string(id)
  Assert.string(parentId)
  Assert.string(uri)
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  return {
    type: 0,
    getModule,
    id,
    parentId,
    uri,
    x,
    y,
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

const getRenderCommands = (module, oldState, newState, uid = newState.uid || module.name) => {
  if (Array.isArray(module.render)) {
    const commands = []
    for (const item of module.render) {
      if (!item.isEqual(oldState, newState)) {
        const command = item.apply(oldState, newState)
        if (command[0] !== 'Viewlet.send' && command[0] !== 'Viewlet.ariaAnnounce') {
          command.unshift('Viewlet.send', uid)
        }
        commands.push(command)
      }
    }
    return commands
  }
  if (module.render) {
    return module.render(oldState, newState)
  }
  return []
}

const registerWrappedCommand = (moduleName, key, wrappedCommand) => {
  if (key.startsWith(moduleName)) {
    Command.register(key, wrappedCommand)
  } else {
    // TODO rename editorText to editor
    if (moduleName === 'EditorText') {
      Command.register(`Editor.${key}`, wrappedCommand)
    } else {
      Command.register(`${moduleName}.${key}`, wrappedCommand)
    }
  }
}

const registerWrappedCommands = (object, id, wrapFn) => {
  for (const [key, value] of Object.entries(object)) {
    const wrappedCommand = wrapFn(id, key, value)
    registerWrappedCommand(id, key, wrappedCommand)
  }
}

const maybeRegisterWrappedCommands = (id, module) => {
  if (module.Commands) {
    registerWrappedCommands(module.Commands, id, wrapViewletCommand)
  }
  if (module.CommandsWithSideEffects) {
    registerWrappedCommands(module.CommandsWithSideEffects, id, wrapViewletCommandWithSideEffect)
  }
  if (module.CommandsWithSideEffectsLazy) {
    registerWrappedCommands(module.CommandsWithSideEffectsLazy, id, wrapViewletCommandWithSideEffectLazy)
  }
  if (module.LazyCommands) {
    registerWrappedCommands(module.LazyCommands, id, wrapViewletCommandLazy)
  }
}

const maybeRegisterEvents = (module) => {
  if (module.Events) {
    // TODO remove event listeners when viewlet is disposed
    for (const [key, value] of Object.entries(module.Events)) {
      const handleUpdate = async (...params) => {
        const instance = ViewletStates.getInstance(module.name)
        const newState = await value(instance.state, ...params)
        if (!newState) {
          throw new Error('newState must be defined')
        }
        if (module.shouldApplyNewstate && !module.shouldApplyNewState(newState)) {
          console.log('[viewlet manager] return', newState)
          return
        }
        const commands = render(instance.factory, instance.state, newState)
        instance.state = newState
        await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
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
    if (Array.isArray(module.Css)) {
      await Css.loadCssStyleSheets(module.Css)
    } else {
      await Css.loadCssStyleSheet(module.Css)
    }
  }
  if (module.getDynamicCss) {
    await Css.addDynamicCss(id, module.getDynamicCss, Preferences.state)
  }
  maybeRegisterWrappedCommands(id, module)
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

export const backgroundLoad = async ({ getModule, id, x, y, width, height, props }) => {
  const module = await loadModule(getModule, id)
  const viewletState = module.create(id, '', y, x, width, height)
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
export const load = async (viewlet, focus = false, restore = false, restoreState = undefined) => {
  // console.time(`load/${viewlet.id}`)
  if (viewlet.type !== 0) {
    console.log('viewlet must be empty')
    throw new Error('viewlet must be empty')
  }
  let state = ViewletState.Default
  // @ts-ignore
  const viewletUid = viewlet.uid || Id.create()
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
    let x = viewlet.x
    let y = viewlet.y
    let width = viewlet.width
    let height = viewlet.height
    if (module.getPosition) {
      const position = module.getPosition()
      x = position.x
      y = position.y
      width = position.width
      height = position.height
    }

    const viewletState = module.create(viewletUid, viewlet.uri, x, y, width, height)
    if (!viewletState.uid) {
      viewletState.uid = viewletUid
    }
    const oldVersion = viewletState.version === undefined ? undefined : ++viewletState.version
    let instanceSavedState
    if (restore) {
      instanceSavedState = await SaveState.getSavedViewletState(viewlet.id)
    } else if (restoreState) {
      instanceSavedState = restoreState
    }
    const args = viewlet.args || []
    let newState = await module.loadContent(viewletState, instanceSavedState, ...args)
    if ((viewlet.visible === undefined || viewlet.visible === true) && module.show) {
      await module.show(newState)
    }
    const extraCommands = []

    if (module.getKeyBindings) {
      const keyBindings = module.getKeyBindings()
      extraCommands.push(['Viewlet.addKeyBindings', viewletUid, keyBindings])
    }

    if (module.getChildren) {
      const children = module.getChildren(newState)
      for (const child of children) {
        const childUid = Id.create()
        const childId = child.id
        try {
          const childModule = await loadModule(viewlet.getModule, childId)
          // TODO get position of child module
          const oldState = childModule.create(childUid, '', child.x, child.y, child.width, child.height)
          let instanceSavedState
          if (restore) {
            instanceSavedState = await SaveState.getSavedViewletState(child.id)
          } else if (restoreState) {
            instanceSavedState = restoreState
          }
          const newState = await childModule.loadContent(oldState, instanceSavedState)
          const childInstance = {
            state: newState,
            factory: childModule,
            moduleId: child.moduleId || child.id,
          }
          ViewletStates.set(childUid, childInstance)
          const childCommands = []
          const commands = getRenderCommands(childModule, oldState, newState, childUid)
          childCommands.push([kCreate, childId, childUid])
          childCommands.push(...commands)
          childCommands.push([kAppend, viewletUid, childUid])
          if (childModule.contentLoadedEffects) {
            await childModule.contentLoadedEffects(newState)
          }
          extraCommands.push(...childCommands)
          if (childModule.getKeyBindings) {
            const keyBindings = childModule.getKeyBindings()
            extraCommands.push(['Viewlet.addKeyBindings', childUid, keyBindings])
          }
        } catch (error) {
          const prettyError = await PrettyError.prepare(error)
          PrettyError.print(prettyError)
          await RendererProcess.invoke(kLoadModule, ViewletModuleId.Error)
          extraCommands.push([kCreate, ViewletModuleId.Error, childUid])
          // @ts-ignore
          if (viewlet.setBounds !== false) {
            extraCommands.push([kSetBounds, childUid, child.x, child.y, child.width, child.height])
          }
          extraCommands.push(['Viewlet.send', /* id */ childUid, 'setMessage', /* message */ `${error}`])
          extraCommands.push([kAppend, viewletUid, childUid])
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
      await RendererProcess.invoke(/* Viewlet.loadModule */ kLoadModule, /* id */ viewlet.id)
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
          ViewletStates.set(viewletUid, {
            state: newState,
            factory: module,
            moduleId: viewlet.moduleId || viewlet.id || '',
          })
          break outer
        }
        newState = await module.loadContent(viewletState)
      }
      throw new Error('viewlet could not be updated')
    } else {
      ViewletStates.set(viewletUid, {
        state: newState,
        factory: module,
        moduleId: viewlet.moduleId || viewlet.id || '',
      })
    }
    const commands = [[kCreate, viewlet.id, viewletUid]]
    if (viewletState !== newState && module.contentLoaded) {
      const additionalExtraCommands = await module.contentLoaded(newState)
      Assert.array(additionalExtraCommands)
      commands.push(...additionalExtraCommands)
    }

    if (module.hasFunctionalRender) {
      const renderCommands = getRenderCommands(module, viewletState, newState, viewletUid)
      commands.push(...renderCommands)
      if (viewlet.show === false) {
        const allCommands = [
          ...commands,
          ...extraCommands,
          // ['Viewlet.show', viewlet.id],
        ]
        if (viewlet.setBounds !== false) {
          allCommands.splice(1, 0, [kSetBounds, viewletUid, x, y, width, height])
        }
        if (module.contentLoadedEffects) {
          module.contentLoadedEffects(newState)
        }
        if (viewlet.append) {
          const parentId = viewlet.parentId
          allCommands.push([kAppend, parentId, viewletUid])
        }
        return allCommands
      }
      // console.log('else', viewlet.id, { commands })
      commands.push(...extraCommands)
      await RendererProcess.invoke(/* Viewlet.sendMultiple */ kSendMultiple, /* commands */ commands)
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
      await RendererProcess.invoke(/* Viewlet.append */ kAppendViewlet, /* parentId */ viewlet.parentId, /* id */ viewletUid, /* focus */ focus)
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
    const prettyError = await PrettyError.prepare(error)
    PrettyError.print(prettyError)
    try {
      if (module && module.handleError) {
        return await module.handleError(error)
      }
      const commands = []
      if (state < ViewletState.RendererProcessViewletLoaded) {
        await RendererProcess.invoke(/* Viewlet.loadModule */ kLoadModule, /* id */ viewlet.id)
      }
      const parentId = viewlet.parentId
      // Assert.string(parentId)
      await RendererProcess.invoke(kLoadModule, ViewletModuleId.Error)
      commands.push([kCreate, ViewletModuleId.Error, viewletUid])
      // @ts-ignore
      if (viewlet.setBounds !== false) {
        commands.push([kSetBounds, viewletUid, viewlet.x, viewlet.y, viewlet.width, viewlet.height])
      }
      commands.push(['Viewlet.send', /* id */ viewletUid, 'setMessage', /* message */ `${error}`])
      commands.push([kAppend, parentId, viewletUid])
      return commands
    } catch (error) {
      console.error(error)
      return []
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

export const render = (module, oldState, newState, uid = newState.uid || module.name) => {
  return getRenderCommands(module, oldState, newState, uid)
}
