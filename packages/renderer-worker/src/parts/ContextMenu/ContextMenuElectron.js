import * as ElectronMenu from '../ElectronMenu/ElectronMenu.js'
import * as ElectronMenuItemFlags from '../ElectronMenuItemFlags/ElectronMenuItemFlags.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

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

export const show = async (x, y, id) => {
  const entries = await MenuEntries.getMenuEntries(id)
  const electronMenuItems = convertMenuItems(entries)
  await ElectronMenu.openContextMenu(electronMenuItems, x, y)
}
