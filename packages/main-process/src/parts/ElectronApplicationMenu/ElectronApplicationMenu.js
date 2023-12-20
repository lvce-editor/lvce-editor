import { Menu } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const setMenu = (menu) => {
  Menu.setApplicationMenu(menu)
}

const click = (menuItem, browserWindow, keys) => {
  SharedProcess.send('ElectronApplicationMenu.handleClick', browserWindow.id, menuItem.label)
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

export const createTitleBar = (items) => {
  const menuBar = Menu.buildFromTemplate(items)
  return menuBar
}
