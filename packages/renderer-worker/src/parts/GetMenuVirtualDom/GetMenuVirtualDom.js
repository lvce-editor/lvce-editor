import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getMenuItemSeparatorDom = (menuItem) => {
  return [
    div(
      {
        className: 'MenuItemSeparator',
        role: AriaRoles.Separator,
      },
      0
    ),
  ]
}

const getMenuItemUncheckedDom = (menuItem) => {
  const { label } = menuItem
  return [
    div(
      {
        className: 'MenuItem',
        role: AriaRoles.MenuItemCheckBox,
        ariaChecked: false,
        tabIndex: -1,
      },
      1
    ),
    text(label),
  ]
}

const getMenuItemDisabledDom = (menuItem) => {
  const { label } = menuItem
  return [
    div(
      {
        className: 'MenuItem',
        role: AriaRoles.MenuItem,
        tabIndex: -1,
        disabled: true,
      },
      1
    ),
    text(label),
  ]
}

const getMenuItemVirtualDom = (menuItem) => {
  const { flags, label } = menuItem
  switch (flags) {
    case MenuItemFlags.Separator:
      return getMenuItemSeparatorDom(menuItem)
    case MenuItemFlags.Unchecked:
      return getMenuItemUncheckedDom(menuItem)
    case MenuItemFlags.Disabled:
      return getMenuItemDisabledDom(menuItem)
    default:
      return []
  }
}

export const getMenuVirtualDom = (menuItems) => {
  const dom = []
  dom.push(
    div(
      {
        className: 'Menu',
        role: AriaRoles.Menu,
        tabIndex: -1,
      },
      menuItems.length
    )
  )
  for (const menuItem of menuItems) {
    dom.push(...getMenuItemVirtualDom(menuItem))
  }
  return dom
}
