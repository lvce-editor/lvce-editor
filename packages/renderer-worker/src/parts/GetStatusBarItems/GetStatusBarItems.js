import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.js'
import * as ExtensionHostManagement from '../ExtensionHostManagement/ExtensionHostManagement.js'

const toUiStatusBarItem = (extensionHostStatusBarItem) => {
  return {
    name: extensionHostStatusBarItem.id || '',
    text: extensionHostStatusBarItem.text || '',
    tooltip: extensionHostStatusBarItem.tooltip || '',
    command: extensionHostStatusBarItem.command || '',
    icon: extensionHostStatusBarItem.icon || '',
  }
}

const toUiStatusBarItems = (statusBarItems) => {
  if (!statusBarItems) {
    return []
  }
  return statusBarItems.map(toUiStatusBarItem)
}

export const getStatusBarItems = async (showItems, assetDir, platform) => {
  if (!showItems) {
    return []
  }
  await ExtensionHostManagement.activateByEvent('onSourceControl', assetDir, platform)
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems()
  const uiStatusBarItems = toUiStatusBarItems(extensionStatusBarItems)
  return uiStatusBarItems
}
