import * as Assert from '../Assert/Assert.js'
import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as ElectronBrowserViewQuickPick from '../ElectronBrowserViewQuickPick/ElectronBrowserViewQuickPick.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as Layout from '../Layout/Layout.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

/**
 * @deprecated
 */
export const focus = (id) => {
  // if(state.instances[id]){
  // }
  // console.log('focus', { id })
  // // TODO open if it is not already open
  // RendererProcess.send([/* viewletFocus */ 3027, /* id */ id])
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

const isQuickPickKeyBinding = (keyBinding) => {
  return keyBinding.when === 'focus.quickPickInput'
}

const getQuickPickKeyBindings = (keyBindings) => {
  return keyBindings.filter(isQuickPickKeyBinding)
}

const openElectronQuickPick = async (...args) => {
  const id = 'QuickPick'
  const width = 600
  const height = 300
  const left = Math.round((Layout.state.windowWidth - width) / 2)
  const top = 50
  const keyBindings = await KeyBindings.getKeyBindings()
  const quickPickKeyBindings = getQuickPickKeyBindings(keyBindings)
  await ElectronBrowserViewQuickPick.createBrowserViewQuickPick(
    top,
    left,
    width,
    height
  )
  const ipc = await IpcParent.create({
    method: IpcParentType.Electron,
    type: 'quickpick',
  })
  const type = args[0]
  const commands = await ViewletManager.load({
    getModule: ViewletModule.load,
    id,
    type: 0,
    // @ts-ignore
    uri: `quickPick://${type}`,
    show: false,
    focus: true,
  })

  const handleMessage = async (event) => {
    const { method, params } = event
    const instance = ViewletStates.getInstance(id)
    const oldState = instance.state
    if (method === 'Viewlet.closeWidget') {
      return closeWidget(id)
    }
    const newState = await instance.factory.Commands[method](
      oldState,
      ...params
    )
    const commands = ViewletManager.render(instance.factory, oldState, newState)
    ipc.send({
      jsonrpc: '2.0',
      method: 'executeCommands',
      params: commands,
    })
    instance.state = newState
  }
  ipc.onmessage = handleMessage
  commands.push([
    'Viewlet.send',
    'QuickPick',
    'setKeyBindings',
    quickPickKeyBindings,
  ])
  ipc.send({
    jsonrpc: '2.0',
    method: 'executeCommands',
    params: commands,
  })
}

export const openWidget = async (id, ...args) => {
  const hasInstance = ViewletStates.hasInstance(id)
  const type = args[0]
  if (ElectronBrowserView.isOpen() && id === 'QuickPick') {
    // TODO recycle quickpick instance
    if (hasInstance) {
      await closeWidgetElectronQuickPick()
    }
    return openElectronQuickPick(...args)
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
  await RendererProcess.invoke('Viewlet.executeCommands', commands)
  // TODO commands should be like this
  // viewlet.create quickpick
  // quickpick.setItems
  // quickpick.setFocusedIndex
  // quickpick.setValue
  // viewlet.show quickpick
  //
}

const closeWidgetElectronQuickPick = async () => {
  const id = 'QuickPick'
  ViewletStates.remove(id)
  await ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick()
}

export const closeWidget = async (id) => {
  if (ElectronBrowserView.isOpen() && id === 'QuickPick') {
    return closeWidgetElectronQuickPick()
  }
  ViewletStates.remove(id)
  await RendererProcess.invoke(
    /* Viewlet.dispose */ 'Viewlet.dispose',
    /* id */ id
  )
}
