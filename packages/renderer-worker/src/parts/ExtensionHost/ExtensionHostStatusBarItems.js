import * as ExtensionHost from './ExtensionHostCore.js'
import * as Listener from '../Listener/Listener.js'
import * as Platform from '../Platform/Platform.js'
import * as ExtensionHostManagement from './ExtensionHostManagement.js'

export const state = {
  changeListeners: [],
}

const getStatusBarItemsFromExtension = (extension) => {
  if (!extension.statusBarItems) {
    return []
  }
  return extension.statusBarItems
}

const getStatusBarItemsFromExtensions = (extensions) => {
  return extensions.flatMap(getStatusBarItemsFromExtension)
}

export const getStatusBarItems = async () => {
  if (Platform.getPlatform() === 'web') {
    return []
  }
  const ipc = await ExtensionHostManagement.activateByEvent('onStatusBarItem')
  const statusBarItems = await ExtensionHost.invoke(
    /* ipc */ ipc,
    /* ExtensionHost.getStatusBarItems */ 'ExtensionHost.getStatusBarItems'
  )
  return statusBarItems
}

// TODO add function to dispose listener
export const onChange = async (listener) => {
  const id = Listener.register(listener)
  await ExtensionHost.invoke(
    /* ExtensionHostStatusBar.registerChangeListener */ 'ExtensionHostStatusBar.registerChangeListener',
    /* id */ id
  )
}
