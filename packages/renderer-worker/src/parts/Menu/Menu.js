// TODO lazyload menuEntries and use Command.execute (maybe)
import * as MenuWorker from '../MenuWorker/MenuWorker.js'

export const MENU_WIDTH = 150

export const show = async (x, y, menuId, mouseBlocking = false, ...args) => {
  await MenuWorker.invoke('Menu.show', menuId, x, y, mouseBlocking)
}

export const show2 = async (uid, menuId, x, y, mouseBlocking = false, ...args) => {
  await MenuWorker.invoke('Menu.show2', menuId, x, y, mouseBlocking)
}

export const closeSubMenu = async () => {
  await MenuWorker.invoke('Menu.closeSubMenu')
}

export const showSubMenu = async (level, index) => {
  await MenuWorker.invoke('Menu.showSubMenu', level, index)
}

export const selectIndex = async (level, index) => {
  await MenuWorker.invoke('Menu.selectIndex', level, index)
}

export const selectItem = async (text) => {
  await MenuWorker.invoke('Menu.selectItem', text)
}

export const selectCurrent = async (level) => {
  await MenuWorker.invoke('Menu.selectCurrent', level)
}

export const hide = async (restoreFocus = true) => {
  await MenuWorker.invoke('Menu.hide', restoreFocus)
}

// TODO difference between focusing with mouse or keyboard
// with mouse -> open submenu
// with keyboard -> don't open submenu, only focus

export const handleMouseEnter = async (level, index, enterX, enterY, enterTimeStamp) => {
  await MenuWorker.invoke('Menu.handleMouseEnter', level, index, enterX, enterY, enterTimeStamp)
}

export const handleMouseLeave = async () => {
  await MenuWorker.invoke('Menu.handleMouseLeave')
}

export const focusIndex = async (menu, index) => {
  await MenuWorker.invoke('Menu.focusIndex', menu, index)
}

export const focusFirst = async () => {
  await MenuWorker.invoke('Menu.focusFirst')
}

export const focusLast = async () => {
  await MenuWorker.invoke('Menu.focusLast')
}

export const focusPrevious = async () => {
  await MenuWorker.invoke('Menu.focusPrevious')
}

export const focusNext = async () => {
  await MenuWorker.invoke('Menu.focusNext')
}

export const resetFocusedIndex = async (menu) => {
  await MenuWorker.invoke('Menu.resetFocusedIndex')
}

// TODO handle printable letter and focus item that starts with that letter

// TODO pageup / pagedown keys

// TODO more tests
