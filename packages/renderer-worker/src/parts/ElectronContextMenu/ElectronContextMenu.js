import * as Command from '../Command/Command.js'
import * as ElectronMenuItemFlags from '../ElectronMenuItemFlags/ElectronMenuItemFlags.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

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

const getItem = (items, label) => {
  for (const item of items) {
    if (item.label === label) {
      return item
    }
  }
  return undefined
}

/**
 * @deprecated
 */
export const openContextMenu = async (x, y, id, ...args) => {
  const entries = await MenuEntries.getMenuEntries(id, ...args)
  const electronMenuItems = convertMenuItems(entries)
  const event = await SharedProcess.invoke('ElectronContextMenu.openContextMenu', electronMenuItems, x, y)
  if (event.type === 'close') {
    return
  }
  const item = getItem(entries, event.data)
  if (!item) {
    return
  }
  const commandArgs = item.args || []
  await Command.execute(item.command, ...commandArgs)
}

export const openContextMenu2 = async (x, y, uid, menuId, ...args) => {
  const entries = await MenuEntries.getMenuEntries2(uid, menuId, ...args)
  const electronMenuItems = convertMenuItems(entries)
  const event = await SharedProcess.invoke('ElectronContextMenu.openContextMenu', electronMenuItems, x, y)
  if (event.type === 'close') {
    return
  }
  const item = getItem(entries, event.data)
  if (!item) {
    return
  }
  const commandArgs = item.args || []
  await Command.execute(item.command, ...commandArgs)
}
