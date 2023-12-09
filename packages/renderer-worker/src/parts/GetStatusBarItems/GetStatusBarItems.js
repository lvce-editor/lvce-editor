import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.js'

const toUiStatusBarItem = (extensionHostStatusBarItem) => {
  return {
    name: extensionHostStatusBarItem.id,
    text: extensionHostStatusBarItem.id,
    tooltip: '',
    command: -1,
    icon: extensionHostStatusBarItem.icon || '',
  }
}

const toUiStatusBarItems = (statusBarItems) => {
  if (!statusBarItems) {
    return []
  }
  return statusBarItems.map(toUiStatusBarItem)
}

export const getStatusBarItems = async (state) => {
  const extensionStatusBarItems = await ExtensionHostStatusBarItems.getStatusBarItems()

  const uiStatusBarItems = toUiStatusBarItems(extensionStatusBarItems)
  return uiStatusBarItems
}
