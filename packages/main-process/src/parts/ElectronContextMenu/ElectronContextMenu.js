const { Menu, BrowserWindow } = require('electron')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.cjs')
const Assert = require('../Assert/Assert.cjs')
const GetElectronMenuItems = require('../GetElectronMenuItems/GetElectronMenuItems.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.cjs')

const getPort = (browserWindow) => {
  const state = AppWindowStates.findByWindowId(browserWindow.id)
  if (!state) {
    console.log('[main-process] menu: message port not found')
    return undefined
  }
  return state.port
}

const click = (menuItem, browserWindow) => {
  const { label } = menuItem
  const port = getPort(browserWindow)
  if (!port) {
    return
  }
  const customData = menuItem.menu.customData || undefined
  port.postMessage({
    jsonrpc: JsonRpcVersion.Two,
    method: 'ElectronContextMenu.handleSelect',
    params: [label, customData],
  })
}

exports.openContextMenu = (menuItems, x, y, customData) => {
  Assert.array(menuItems)
  Assert.number(x)
  Assert.number(y)
  const template = GetElectronMenuItems.getElectronMenuItems(menuItems, click)
  const menu = Menu.buildFromTemplate(template)
  // @ts-ignore
  menu.customData = customData
  const window = BrowserWindow.getFocusedWindow()
  if (!window) {
    return
  }
  const callback = () => {
    const port = getPort(window)
    if (!port) {
      return
    }
    port.postMessage({
      jsonrpc: JsonRpcVersion.Two,
      method: 'ElectronContextMenu.handleMenuClose',
      params: [],
    })
  }
  menu.popup({ window, x, y, callback })
}
