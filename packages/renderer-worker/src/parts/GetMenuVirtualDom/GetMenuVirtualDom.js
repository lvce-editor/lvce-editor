import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getMenuItemSeparatorDom = (menuItem) => {
  return [
    div(
      {
        className: 'MenuItemSeparator',
        role: 'seperator',
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
        role: 'menuitemcheckbox',
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
        role: 'menuitem',
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
        role: 'menu',
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
