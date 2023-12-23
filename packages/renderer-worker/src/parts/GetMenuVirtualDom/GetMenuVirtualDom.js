import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const ClassNames = {
  MenuItemSeparator: 'MenuItemSeparator',
  MenuItem: 'MenuItem',
  Menu: 'Menu',
  MenuItemFocused: 'MenuItemFocused',
  MenuItemSubMenu: 'MenuItemSubMenu',
}

const getMenuItemSeparatorDom = (menuItem) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.MenuItemSeparator,
      role: AriaRoles.Separator,
      childCount: 0,
    },
  ]
}

const getMenuItemUncheckedDom = (menuItem) => {
  const { label } = menuItem
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.MenuItem,
      role: AriaRoles.MenuItemCheckBox,
      ariaChecked: false,
      tabIndex: -1,
      childCount: 1,
    },
    text(label),
  ]
}

const getMenuItemDisabledDom = (menuItem) => {
  const { label } = menuItem
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.MenuItem,
      role: AriaRoles.MenuItem,
      tabIndex: -1,
      disabled: true,
      childCount: 1,
    },
    text(label),
  ]
}

const getMenuItemDefaultDom = (menuItem) => {
  const { label, isFocused } = menuItem
  let className = ClassNames.MenuItem
  if (isFocused) {
    className += ' ' + ClassNames.MenuItemFocused
  }
  return [
    {
      type: VirtualDomElements.Div,
      className,
      role: AriaRoles.MenuItem,
      tabIndex: -1,
      disabled: true,
      childCount: 1,
    },
    text(label),
  ]
}

const getMenuItemSubMenuDom = (menuItem) => {
  const { label, isFocused, isExpanded, level } = menuItem
  let className = ClassNames.MenuItem
  className += ' ' + ClassNames.MenuItemSubMenu
  if (isFocused) {
    className += ' ' + ClassNames.MenuItemFocused
  }
  return [
    {
      type: VirtualDomElements.Div,
      className,
      role: AriaRoles.MenuItem,
      tabIndex: -1,
      ariaHasPopup: true,
      ariaExpanded: isExpanded,
      ariaOwns: isExpanded ? `Menu-${level + 1}` : undefined,
      childCount: 1,
    },
    text(label),
  ]
}

const getMenuItemVirtualDom = (menuItem) => {
  const { flags, label } = menuItem
  switch (flags) {
    case MenuItemFlags.None:
    case MenuItemFlags.RestoreFocus:
    case MenuItemFlags.Ignore:
      return getMenuItemDefaultDom(menuItem)
    case MenuItemFlags.Separator:
      return getMenuItemSeparatorDom(menuItem)
    case MenuItemFlags.Unchecked:
      return getMenuItemUncheckedDom(menuItem)
    case MenuItemFlags.Disabled:
      return getMenuItemDisabledDom(menuItem)
    case MenuItemFlags.SubMenu:
      return getMenuItemSubMenuDom(menuItem)
    default:
      return []
  }
}

export const getMenuVirtualDom = (menuItems) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: ClassNames.Menu,
    role: AriaRoles.Menu,
    tabIndex: -1,
    childCount: menuItems.length,
  })
  dom.push(...menuItems.flatMap(getMenuItemVirtualDom))
  return dom
}
