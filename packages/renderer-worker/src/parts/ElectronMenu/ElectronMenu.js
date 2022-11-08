import * as ElectronMenuItemFlags from '../ElectronMenuItemFlags/ElectronMenuItemFlags.js'
import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Command from '../Command/Command.js'

const EMPTY_MENU = []

export const state = {
  pendingMenus: EMPTY_MENU,
}

const convertMenuItem = (menuItem) => {
  const { flags, label } = menuItem
  switch (flags) {
    case MenuItemFlags.Separator:
      return {
        type: ElectronMenuItemFlags.Separator,
      }
    default:
      return {
        label,
      }
  }
}

const convertMenuItems = (menuItems) => {
  return menuItems.map(convertMenuItem)
}

export const openContextMenu = async (x, y, id, ...args) => {
  console.log({ x, y, id, args })
  const entries = await MenuEntries.getMenuEntries(id, ...args)
  state.pendingMenus = entries
  const electronMenuItems = convertMenuItems(entries)
  return ElectronProcess.invoke(
    'ElectronMenu.openContextMenu',
    electronMenuItems,
    x,
    y
  )
}

export const handleMenuClose = () => {
  state.pendingMenus = EMPTY_MENU
}

const getItem = (items, label) => {
  for (const item of items) {
    if (item.label === label) {
      return item
    }
  }
  return undefined
}

export const handleSelect = async (label) => {
  const items = state.pendingMenus
  state.pendingMenus = EMPTY_MENU
  const item = getItem(items, label)
  if (!item) {
    return
  }
  const args = item.args || []
  await Command.execute(item.command, ...args)
}
