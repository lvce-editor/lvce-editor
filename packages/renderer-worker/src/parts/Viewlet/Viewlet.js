import * as Assert from '../Assert/Assert.ts'
import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Id from '../Id/Id.js'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.js'
import * as Logger from '../Logger/Logger.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as UpdateDynamicFocusContext from '../UpdateDynamicFocusContext/UpdateDynamicFocusContext.js'
import { VError } from '../VError/VError.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletElectron from './ViewletElectron.js'

export const focus = async (id) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    return
  }
  const commands = []
  if (instance && instance.factory.focus) {
    const oldState = instance.state
    const newState = instance.factory.focus(oldState)
    commands.push(...ViewletManager.render(instance.factory, oldState, newState))
  }
  const oldInstance = ViewletStates.getFocusedInstance()
  if (oldInstance && oldInstance && oldInstance.factory.handleBlur) {
    const oldState = oldInstance.state
    const newState = oldInstance.factory.handleBlur(oldState)
    commands.push(...ViewletManager.render(oldInstance.factory, oldState, newState))
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
}
// export const createOrFocus = async id=>{
//   const instance = state.instances[id] || await create(id)
// }

/**
 * @deprecated
 */
export const refreshInstance = async (instance, id) => {
  if (!instance) {
    return
  }
  if (instance.status === 'refreshing' || instance.status === 'disposed') {
    return
  }
  instance.status = 'refreshing'
  try {
    await instance.factory.refresh(instance.state)
  } catch (error) {
    if (instance.factory.handleError) {
      try {
        await instance.factory.handleError(error)
      } catch (innerError) {
        console.error(innerError)
        console.error(error)
        return
      }
    }
    // TODO use ErrorHandling.handleError
    // TODO show notification maybe
    console.error(error)
    instance.status = 'error'
    return
  }
  instance.status = 'refreshed'
}

// TODO should refresh instance?
/**
 * @deprecated
 */
export const refresh = async (id) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    return
  }
  await refreshInstance(instance, id)
}

/**
 * @deprecated
 */
export const send = (id, method, ...args) => {
  // console.trace(`viewlet.send is deprecated`)
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    console.info('instance disposed', { id, method, args })
    return
  }
  const fn = instance.factory[method]
  Assert.fn(fn)
  fn(instance.state, ...args)
}

/**
 * @deprecated
 */
export const dispose = async (id) => {
  if (!id) {
    console.warn('no instance to dispose')
    return
  }
  const instance = ViewletStates.getInstance(id)
  if (!instance) {
    console.info('instance may already be disposed')
    return
  }
  const instanceUid = instance.state.uid
  // TODO status should have enum
  instance.status = 'disposing'
  try {
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    instance.factory.dispose(instance.state)
    await RendererProcess.invoke(/* Viewlet.dispose */ 'Viewlet.dispose', /* id */ instanceUid)
    if (instance.factory.getKeyBindings) {
      KeyBindingsState.removeKeyBindings(instanceUid)
    }
  } catch (error) {
    console.error(error)
    // TODO use Error.cause once proper stack traces are supported by chrome
    throw new Error(`Failed to dispose viewlet ${id}: ${error}`)
  }
  instance.status = 'disposed'
  ViewletStates.remove(id)
  await GlobalEventBus.emitEvent(`Viewlet.dispose.${id}`)
}

export const disposeFunctional = (id) => {
  try {
    if (!id) {
      console.warn('no instance to dispose')
      return []
    }
    const instance = ViewletStates.getInstance(id)
    if (!instance) {
      Logger.warn(`cannot dispose instance ${id} because it may already be disposed`)
      return []
    }
    // TODO status should have enum
    instance.status = 'disposing'
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    if (instance.factory.dispose) {
      instance.factory.dispose(instance.state)
    }
    const uid = instance.state.uid
    Assert.number(uid)
    const commands = [[/* Viewlet.dispose */ 'Viewlet.dispose', /* id */ uid]]

    if (instance.factory.getKeyBindings) {
      KeyBindingsState.removeKeyBindings(id)
    }
    if (instance.factory.getChildren) {
      const children = instance.factory.getChildren(instance.state)
      for (const child of children) {
        if (child.id) {
          commands.push(...disposeFunctional(child.id))
        }
      }
    }
    instance.status = 'disposed'
    ViewletStates.remove(id)
    ViewletStates.remove(uid)
    return commands
  } catch (error) {
    console.error(error)
    // TODO use Error.cause once proper stack traces are supported by chrome
    throw new Error(`Failed to dispose viewlet ${id}: ${error}`)
  }
}

export const showFunctional = (id) => {
  const instance = ViewletStates.getInstance(id)
  const initialState = instance.factory.create()
  // TODO resize
  const commands = ViewletManager.render(instance.factory, initialState, instance.state)
  // TODO avoid side effect, instead return an array of
  // commands to send to shared process
  // @ts-ignore
  const promise = instance.factory.show(instance.state)
  return commands
}

// TODO hidden editors should not keep state in memory
// store hidden editor state in session storage or indexeddb
// when reopening the editor, retrieve the state from there
export const hideFunctional = (id) => {
  try {
    if (!id) {
      console.warn('no instance to dispose')
      return []
    }
    const instance = ViewletStates.getInstance(id)
    if (!instance) {
      Logger.warn(`cannot dispose instance ${id} because it may already be disposed`)
      return []
    }
    // TODO status should have enum
    instance.status = 'disposing'
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    if (instance.factory.hide) {
      instance.factory.hide(instance.state)
      return []
    }
    if (instance.factory.dispose) {
      instance.factory.dispose(instance.state)
    }
    const uid = instance.state.uid
    Assert.number(uid)
    const commands = [[/* Viewlet.dispose */ 'Viewlet.dispose', /* id */ uid]]

    if (instance.factory.getKeyBindings) {
      KeyBindingsState.removeKeyBindings(id)
    }
    if (instance.factory.getChildren) {
      const children = instance.factory.getChildren(instance.state)
      for (const child of children) {
        if (child.id) {
          commands.push(...disposeFunctional(child.id))
        }
      }
    }
    instance.status = 'disposed'
    ViewletStates.remove(id)
    ViewletStates.remove(uid)
    return commands
  } catch (error) {
    console.error(error)
    // TODO use Error.cause once proper stack traces are supported by chrome
    throw new Error(`Failed to dispose viewlet ${id}: ${error}`)
  }
}

/**
 * @deprecated
 */
export const replace = () => {}

export const resize = async (id, dimensions) => {
  Assert.number(id)
  Assert.object(dimensions)
  const instance = ViewletStates.getInstance(id)
  if (!instance || !instance.factory || (!instance.factory.resize && !instance.factory?.Commands?.resize)) {
    console.warn('cannot resize', id)
    return []
  }
  const resizeFn = instance.factory?.Commands?.resize || instance.factory.resize
  const oldState = instance.state
  let newState = oldState
  let commands = []
  if (instance.factory.hasFunctionalResize) {
    newState = await resizeFn(oldState, dimensions)
    if ('newState' in newState) {
      throw new Error(`functional resize not supported in ${instance.factory.name}`)
    }
    if (instance.factory.resizeEffect) {
      // TODO handle promise rejection gracefully
      instance.factory.resizeEffect(newState)
    }
    commands = ViewletManager.render(instance.factory, instance.state, newState)
  } else if (typeof instance.factory.resize === 'function') {
    // deprecated
    const result = await instance.factory.resize(oldState, dimensions)
    newState = result.newState
    commands = result.commands
  }
  Assert.object(newState)
  Assert.array(commands)
  ViewletStates.setState(id, newState)
  return commands
}

export const handleFocusChange = (id, isFocused) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance || !instance.factory || !instance.factory.handleFocusChange) {
    return []
  }
  const oldState = instance.state
  const newState = instance.factory.handleFocusChange(oldState, isFocused)
  const commands = ViewletManager.render(instance.factory, instance.state, newState)
  Assert.object(newState)
  Assert.array(commands)
  ViewletStates.setState(id, newState)
  return commands
}

export const getState = (id) => {
  const instance = ViewletStates.getInstance(id)
  return instance.state
}

export const setStateFunctional = (id, newState) => {
  const instance = ViewletStates.getInstance(id)
  if (instance && instance.factory && instance.factory.hasFunctionalRender) {
    const oldState = instance.state
    const commands = ViewletManager.render(instance.factory, oldState, newState)
    instance.state = newState
    return commands
  }
  return []
}

export const setState = async (id, newState) => {
  const commands = setStateFunctional(id, newState)
  if (commands.length > 0) {
    await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ commands)
  }
}

export const getAllStates = () => {
  const states = Object.create(null)
  for (const [key, value] of Object.entries(ViewletStates.getAllInstances())) {
    states[key] = value.state
  }
  return states
}

export const openWidget = async (moduleId, ...args) => {
  const hasInstance = ViewletStates.hasInstance(moduleId)
  const type = args[0]
  if (ElectronBrowserView.isOpen() && moduleId === ViewletModuleId.QuickPick) {
    // TODO recycle quickpick instance
    if (hasInstance) {
      await ViewletElectron.closeWidgetElectronQuickPick()
    }
    return ViewletElectron.openElectronQuickPick(...args)
  }
  const childUid = Id.create()
  const commands = await ViewletManager.load({
    getModule: ViewletModule.load,
    id: moduleId,
    type: 0,
    // @ts-ignore
    uri: `quickPick://${type}`,
    show: false,
    focus: true,
    args,
    uid: childUid,
  })
  if (!commands) {
    throw new Error('expected commands to be of type array')
  }

  if (hasInstance) {
    commands.unshift(['Viewlet.dispose', moduleId])
  }
  const layout = ViewletStates.getState(ViewletModuleId.Layout)
  const focusByNameIndex = commands.findIndex((command) => command[0] === 'Viewlet.focusElementByName')

  const append = ['Viewlet.append', layout.uid, childUid]
  if (focusByNameIndex !== -1) {
    commands.splice(focusByNameIndex, 0, append)
  } else {
    commands.push(['Viewlet.append', layout.uid, childUid])
  }

  // TODO send focus changes to renderer process together with other message
  UpdateDynamicFocusContext.updateDynamicFocusContext(commands)
  commands.push(['Viewlet.focus', childUid])
  await RendererProcess.invoke('Viewlet.executeCommands', commands)
}

export const closeWidget = async (id) => {
  try {
    if (ElectronBrowserView.isOpen() && id === ViewletElectron.isQuickPickOpen()) {
      return ViewletElectron.closeWidgetElectronQuickPick()
    }
    const childInstance = ViewletStates.getInstance(id)
    if (!childInstance) {
      return
    }
    const child = childInstance.state
    const childUid = child.uid
    const commands = disposeFunctional(childUid)
    await RendererProcess.invoke(/* Viewlet.dispose */ 'Viewlet.sendMultiple', commands)
    // TODO restore focus
  } catch (error) {
    throw new VError(error, `Failed to close widget ${id}`)
  }
}

const getLazyImport = (module, fnName) => {
  if (module.LazyCommands && module.LazyCommands[fnName]) {
    return module.LazyCommands[fnName]
  }
  if (module.CommandsWithSideEffectsLazy && module.CommandsWithSideEffectsLazy[fnName]) {
    return module.CommandsWithSideEffectsLazy[fnName]
  }
  return undefined
}

const getFn = async (module, fnName) => {
  if (module.Commands && module.Commands[fnName]) {
    return module.Commands[fnName]
  }
  if (module.CommandsWithSideEffects && module.CommandsWithSideEffects[fnName]) {
    return module.CommandsWithSideEffects[fnName]
  }
  const lazyImport = getLazyImport(module, fnName)
  if (!lazyImport) {
    throw new Error(`Command ${module.name}.${fnName} not found in renderer worker`)
  }
  const importedModule = await lazyImport()
  const lazyFn = importedModule[fnName]
  if (!lazyFn) {
    throw new Error(`Command not found ${module.name}.${fnName}`)
  }
  return lazyFn
}

export const executeViewletCommand = async (uid, fnName, ...args) => {
  const instance = ViewletStates.getInstance(uid)
  if (!instance) {
    Logger.warn(`cannot execute ${fnName} instance not found ${uid}`)
    return
  }
  const fn = await getFn(instance.factory, fnName)
  const oldState = instance.state
  const newState = await fn(oldState, ...args)
  const actualNewState = 'newState' in newState ? newState.newState : newState
  if (oldState === actualNewState) {
    return
  }
  if (!ViewletStates.hasInstance(uid)) {
    return
  }
  const commands = ViewletManager.render(instance.factory, instance.renderedState, actualNewState)
  if ('newState' in newState) {
    commands.push(...newState.commands)
  }
  UpdateDynamicFocusContext.updateDynamicFocusContext(commands)
  ViewletStates.setRenderedState(uid, actualNewState)
  if (commands.length === 0) {
    return
  }
  await RendererProcess.invoke(/* Viewlet.sendMultiple */ 'Viewlet.sendMultiple', /* commands */ commands)
}

// @ts-ignore
export const disposeWidgetWithValue = async (id, value) => {
  try {
    if (!id) {
      console.warn('no instance to dispose')
      return []
    }
    const instance = ViewletStates.getInstance(id)
    if (!instance) {
      Logger.warn(`cannot dispose instance ${id} because it may already be disposed`)
      return []
    }
    // TODO status should have enum
    instance.status = 'disposing'
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    if (instance.factory.dispose) {
      instance.factory.dispose(instance.state)
    }
    const uid = instance.state.uid
    Assert.number(uid)
    const commands = [[/* Viewlet.dispose */ 'Viewlet.dispose', /* id */ uid]]
    if (instance.factory.getKeyBindings) {
      KeyBindingsState.removeKeyBindings(uid)
    }
    if (instance.factory.getChildren) {
      const children = instance.factory.getChildren(instance.state)
      for (const child of children) {
        if (child.id) {
          commands.push(...disposeFunctional(child.id))
        }
      }
    }
    instance.status = 'disposed'
    ViewletStates.remove(id)
    ViewletStates.remove(uid)
    await RendererProcess.invoke('Viewlet.sendMultiple', commands)
    // return commands
    const parentInstance = ViewletStates.getInstance(ViewletModuleId.KeyBindings)
    if (!parentInstance) {
      return
    }
    // @ts-ignore
    const newState = parentInstance.factory.handleDefineKeyBindingDisposed(parentInstance.state, value)
  } catch (error) {
    console.error(error)
    // TODO use Error.cause once proper stack traces are supported by chrome
    throw new Error(`Failed to dispose viewlet ${id}: ${error}`)
  }
}
