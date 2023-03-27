import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
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
    case MenuItemFlags.Ignore:
      $MenuItem.className = 'MenuItem'
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Separator:
      $MenuItem.className = 'MenuItemSeparator'
      $MenuItem.role = AriaRoles.Separator
      break
    case MenuItemFlags.Checked:
      $MenuItem.className = 'MenuItem'
      $MenuItem.role = AriaRoles.MenuItemCheckBox
      $MenuItem.ariaChecked = AriaBoolean.True
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Unchecked:
      $MenuItem.className = 'MenuItem'
      $MenuItem.role = AriaRoles.MenuItemCheckBox
      $MenuItem.ariaChecked = AriaBoolean.False
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.SubMenu:
      $MenuItem.className = 'MenuItem'
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.ariaHasPopup = AriaBoolean.True
      $MenuItem.ariaExpanded = AriaBoolean.False
      break
    case MenuItemFlags.Disabled:
      $MenuItem.className = 'MenuItem'
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.setAttribute('disabled', AriaBoolean.True)
      break
    default:
      $MenuItem.className = 'MenuItem'
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      Logger.warn('invalid menu item flags:', item)
      break
  }
  return $MenuItem
}
