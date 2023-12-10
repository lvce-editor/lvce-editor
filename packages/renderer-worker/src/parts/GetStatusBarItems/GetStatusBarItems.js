import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.js'

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

export const getStatusBarItems = async (showItems) => {
  if (!showItems) {
    return []
  }
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems()
  const uiStatusBarItems = toUiStatusBarItems(extensionStatusBarItems)
  return uiStatusBarItems
}
