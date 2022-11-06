const { Menu, BrowserWindow } = require('electron')
const Assert = require('../Assert/Assert.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')

const getPort = (browserWindow) => {
  const state = AppWindowStates.findById(browserWindow.webContents.id)
  if (!state) {
    console.log('[main-process] menu message port not found')
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
  port.postMessage({
    jsonrpc: '2.0',
    method: 'ElectronMenu.handleSelect',
    params: [label],
  })
}

const toMenuItem = (menuItem) => {
  return {
    ...menuItem,
    click,
  }
}

const toTemplate = (menuItems) => {
  return menuItems.map(toMenuItem)
}

exports.openContextMenu = (menuItems, x, y) => {
  Assert.array(menuItems)
  Assert.number(x)
  Assert.number(y)
  const template = toTemplate(menuItems)
  const menu = Menu.buildFromTemplate(template)
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
      jsonrpc: '2.0',
      method: 'ElectronMenu.handleMenuClose',
      params: [],
    })
  }
  menu.popup({ window, x, y, callback })
}
