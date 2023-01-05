import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Logger from '../Logger/Logger.js'

const getLabel = (item) => {
  if (!item || !item.label) {
    Logger.warn('menu item has missing label', item)
    return 'n/a'
  }
  return item.label
}

export const create$MenuItem = (item) => {
  const $MenuItem = document.createElement('div')
  switch (item.flags) {
    case MenuItemFlags.None:
    case MenuItemFlags.RestoreFocus:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Separator:
      $MenuItem.className = 'MenuItemSeparator'
      // @ts-ignore
      $MenuItem.role = AriaRoles.Separator
      break
    case MenuItemFlags.Checked:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItemCheckBox
      $MenuItem.ariaChecked = 'true'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Unchecked:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItemCheckBox
      $MenuItem.ariaChecked = 'false'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.SubMenu:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.ariaHasPopup = 'true'
      $MenuItem.ariaExpanded = 'false'
      break
    case MenuItemFlags.Disabled:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.setAttribute('disabled', 'true')
      break
    default:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      Logger.warn('invalid menu item flags:', item)
      break
  }
  return $MenuItem
}
