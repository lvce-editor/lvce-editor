const { Menu } = require('electron')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')

/**
 * @enum {string}
 */
const UiStrings = {
  File: 'File',
  Edit: 'Edit',
  Selection: 'Selection',
  View: 'View',
  Go: 'Go',
  Run: 'Run',
  Terminal: 'Terminal',
  Window: 'Window',
  Help: 'Help',
}

exports.setMenu = (menu) => {
  Menu.setApplicationMenu(menu)
}

const click = (menuItem, browserWindow, keys) => {
  const { port } = AppWindowStates.findById(browserWindow.webContents.id)
  port.postMessage({
    jsonrpc: JsonRpcVersion.Two,
    method: 'ElectronApplicationMenu.handleClick',
    params: [menuItem.label],
  })
}

const addClickListener = (item) => {
  if (item.submenu) {
    return {
      ...item,
      click,
      submenu: item.submenu.map(addClickListener),
    }
  }
  return {
    ...item,
    click,
  }
}

exports.setItems = (items) => {
  const itemsWithClickListeners = items.map(addClickListener)
  // console.log(JSON.stringify(items, null, 2))
  const menu = Menu.buildFromTemplate(itemsWithClickListeners)
  exports.setMenu(menu)
}

exports.createTitleBar = () => {
  const menuBar = Menu.buildFromTemplate([
    {
      label: UiStrings.File,
    },
    {
      label: UiStrings.Edit,
    },
    {
      label: UiStrings.Selection,
    },
    {
      label: UiStrings.View,
    },
    {
      label: UiStrings.Go,
    },
    {
      label: UiStrings.Run,
    },
    {
      label: UiStrings.Terminal,
    },
    {
      label: UiStrings.Window,
    },
    {
      label: UiStrings.Help,
    },
  ])
  return menuBar
}
