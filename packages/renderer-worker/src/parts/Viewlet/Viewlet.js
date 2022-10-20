import * as Assert from '../Assert/Assert.js'
import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
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
    commands.push(
      ...ViewletManager.render(instance.factory, oldState, newState)
    )
  }
  const oldInstance = ViewletStates.getFocusedInstance()
  if (oldInstance) {
    if (oldInstance && oldInstance.factory.handleBlur) {
      const oldState = oldInstance.state
      const newState = oldInstance.factory.handleBlur(oldState)
      commands.push(
        ...ViewletManager.render(oldInstance.factory, oldState, newState)
      )
    }
  }
  ViewletStates.setFocusedInstance(instance)
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
  // TODO status should have enum
  instance.status = 'disposing'
  try {
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    instance.factory.dispose(instance.state)
    await RendererProcess.invoke(
      /* Viewlet.dispose */ 'Viewlet.dispose',
      /* id */ id
    )
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
      console.info('instance may already be disposed')
      return []
    }
    // TODO status should have enum
    instance.status = 'disposing'
    if (!instance.factory) {
      throw new Error(`${id} is missing a factory function`)
    }
    instance.factory.dispose(instance.state)
    instance.status = 'disposed'
    ViewletStates.remove(id)
    return [[/* Viewlet.dispose */ 'Viewlet.dispose', /* id */ id]]
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

export const resize = (id, dimensions) => {
  const instance = ViewletStates.getInstance(id)
  if (!instance || !instance.factory || !instance.factory.resize) {
    console.warn('cannot resize', id)
    return []
  }
  const oldState = instance.state
  let newState
  let commands
  if (instance.factory.hasFunctionalResize) {
    newState = instance.factory.resize(oldState, dimensions)
    if ('newState' in newState) {
      throw new Error(
        `functional resize not supported in ${instance.factory.name}`
      )
    }
    commands = ViewletManager.render(instance.factory, instance.state, newState)
  } else {
    const result = instance.factory.resize(oldState, dimensions)
    newState = result.newState
    commands = result.commands
  }
  Assert.object(newState)
  Assert.array(commands)
  ViewletStates.setState(id, newState)
  return commands
}

export const getState = (id) => {
  const instance = ViewletStates.getInstance(id)
  return instance.state
}

export const setState = async (id, newState) => {
  const instance = ViewletStates.getInstance(id)
  if (instance && instance.factory && instance.factory.hasFunctionalRender) {
    const oldState = instance.state
    const commands = ViewletManager.render(instance.factory, oldState, newState)
    instance.state = newState
    await RendererProcess.invoke(
      /* Viewlet.sendMultiple */ 'Viewlet.sendMultiple',
      /* commands */ commands
    )
  }
}

export const getAllStates = () => {
  const states = Object.create(null)
  for (const [key, value] of Object.entries(ViewletStates.getAllInstances())) {
    states[key] = value.state
  }
  return states
}

export const openWidget = async (id, ...args) => {
  const hasInstance = ViewletStates.hasInstance(id)
  const type = args[0]
  if (ElectronBrowserView.isOpen() && id === ViewletModuleId.QuickPick) {
    // TODO recycle quickpick instance
    if (hasInstance) {
      await ViewletElectron.closeWidgetElectronQuickPick()
    }
    return ViewletElectron.openElectronQuickPick(...args)
  }
  const commands = await ViewletManager.load({
    getModule: ViewletModule.load,
    id,
    type: 0,
    // @ts-ignore
    uri: `quickPick://${type}`,
    show: false,
    focus: true,
  })
  if (!commands) {
    throw new Error('expected commands to be of type array')
  }

  if (hasInstance) {
    commands.unshift(['Viewlet.dispose', id])
  }
  commands.push(['Viewlet.append', 'Layout', id])
  commands.push(['Viewlet.focus', id])
  await RendererProcess.invoke('Viewlet.executeCommands', commands)
  // TODO commands should be like this
  // viewlet.create quickpick
  // quickpick.setItems
  // quickpick.setFocusedIndex
  // quickpick.setValue
  // viewlet.show quickpick
  //
}

export const closeWidget = async (id) => {
  if (
    ElectronBrowserView.isOpen() &&
    id === ViewletElectron.isQuickPickOpen()
  ) {
    return ViewletElectron.closeWidgetElectronQuickPick()
  }
  ViewletStates.remove(id)
  await RendererProcess.invoke(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ id
  )
  // TODO restore focus
}
