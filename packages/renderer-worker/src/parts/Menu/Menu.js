import * as RendererProcess from '../RendererProcess/RendererProcess.js'
// TODO lazyload menuEntries and use Command.execute (maybe)
import * as GetMenuEntriesWithKeyBindings from '../GetMenuEntriesWithKeyBindings/GetMenuEntriesWithKeyBindings.js'
import * as MenuWorker from '../MenuWorker/MenuWorker.js'

export const MENU_WIDTH = 150

export const show = async (x, y, menuId, mouseBlocking = false, ...args) => {
  const items = await GetMenuEntriesWithKeyBindings.getMenuEntriesWithKeyBindings(menuId, ...args)
  const { commands, menu } = await MenuWorker.invoke('Menu.getShowCommands', items, menuId, x, y, mouseBlocking)
  await RendererProcess.invoke(...commands)
}

export const show2 = async (uid, menuId, x, y, mouseBlocking = false, ...args) => {
  const items = await GetMenuEntriesWithKeyBindings.getMenuEntriesWithKeyBindings2(uid, menuId, ...args)
  const { commands, menu } = await MenuWorker.invoke('Menu.getShowCommands', items, menuId, x, y, mouseBlocking)
  await RendererProcess.invoke(...commands)
}

export const closeSubMenu = async () => {
  const { commands, menu } = await MenuWorker.invoke('Menu.closeSubMenu')
  // @ts-ignore
  await RendererProcess.invoke(...commands)
}

export const showSubMenu = async (level, index) => {
  const { commands, menu } = await MenuWorker.invoke('Menu.showSubMenu')
  await RendererProcess.invoke(...commands)
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
