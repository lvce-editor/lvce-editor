import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'
import * as ElectronBrowserViewQuickPick from '../ElectronBrowserViewQuickPick/ElectronBrowserViewQuickPick.js'
import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as KeyBindings from '../KeyBindings/KeyBindings.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as ViewletManager from '../ViewletManager/ViewletManager.js'
import * as ViewletModule from '../ViewletModule/ViewletModule.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const state = {
  isQuickPickOpen: false,
}

const isQuickPickKeyBinding = (keyBinding) => {
  return keyBinding.when === 'focus.quickPickInput'
}

const getQuickPickKeyBindings = (keyBindings) => {
  return keyBindings.filter(isQuickPickKeyBinding)
}

export const isQuickPickOpen = () => {
  return state.isQuickPickOpen
}

export const openElectronQuickPick = async (...args) => {
  // TODO avoid side effect
  state.isQuickPickOpen = true
  const id = ViewletModuleId.QuickPick
  const width = 600
  const height = 300
  const viewletLayout = ViewletStates.getState(ViewletModuleId.Layout)
  const windowWidth = viewletLayout.points[0]
  const left = Math.round((windowWidth - width) / 2)
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
      return closeWidgetElectronQuickPick()
    }
    const newState = await instance.factory.Commands[method](
      oldState,
      ...params
    )
    const commands = ViewletManager.render(instance.factory, oldState, newState)
    ipc.send({
      jsonrpc: JsonRpcVersion.Two,
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
    jsonrpc: JsonRpcVersion.Two,
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

export const closeWidgetElectronQuickPick = async () => {
  const id = ViewletModuleId.QuickPick
  state.isQuickPickOpen = false
  ViewletStates.remove(id)
  await ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick()
  // TODO restore focus to previously focused element
  await ElectronWindow.focus()
}
