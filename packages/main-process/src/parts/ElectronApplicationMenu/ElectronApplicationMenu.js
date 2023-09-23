import { Menu } from 'electron'
import * as Assert from '../Assert/Assert.cjs'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.cjs'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

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

export const setMenu = (menu) => {
  Menu.setApplicationMenu(menu)
}

const click = (menuItem, browserWindow, keys) => {
  console.log('send handle click')
  SharedProcess.state.sharedProcess.send({
    jsonrpc: JsonRpcVersion.Two,
    method: 'ElectronApplicationMenu.handleClick',
    params: [browserWindow.id, menuItem.label],
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

export const setItems = (items) => {
  Assert.array(items)
  const itemsWithClickListeners = items.map(addClickListener)
  const menu = Menu.buildFromTemplate(itemsWithClickListeners)
  setMenu(menu)
}

export const createTitleBar = () => {
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
