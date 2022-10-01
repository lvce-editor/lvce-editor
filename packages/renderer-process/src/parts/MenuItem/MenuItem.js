import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

const getLabel = (item) => {
  if (!item || !item.label) {
    console.warn('menu item has missing label', item)
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
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Separator:
      $MenuItem.className = 'MenuItemSeparator'
      // @ts-ignore
      $MenuItem.role = 'separator'
      break
    case MenuItemFlags.Checked:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitemcheckbox'
      $MenuItem.ariaChecked = 'true'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Unchecked:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitemcheckbox'
      $MenuItem.ariaChecked = 'false'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.SubMenu:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.ariaHasPopup = 'true'
      $MenuItem.ariaExpanded = 'false'
      break
    case MenuItemFlags.Disabled:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      $MenuItem.setAttribute('disabled', 'true')
      break
    default:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = getLabel(item)
      $MenuItem.tabIndex = -1
      console.warn('invalid menu item flags:', item)
      break
  }
  return $MenuItem
}
