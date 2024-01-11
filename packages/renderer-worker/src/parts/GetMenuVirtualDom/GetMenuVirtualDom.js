import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as ParseKey from '../ParseKey/ParseKey.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const separator = {
  type: VirtualDomElements.Div,
  className: ClassNames.MenuItemSeparator,
  role: AriaRoles.Separator,
  childCount: 1,
}

const separatorLine = {
  type: VirtualDomElements.Div,
  className: ClassNames.MenuItemSeparatorLine,
  childCount: 0,
}

const checkboxUnchecked = {
  type: VirtualDomElements.Div,
  className: ClassNames.MenuItem,
  role: AriaRoles.MenuItemCheckBox,
  ariaChecked: false,
  tabIndex: -1,
  childCount: 1,
}

const checkboxChecked = {
  type: VirtualDomElements.Div,
  className: `${ClassNames.MenuItem} MenuItemCheckMark`,
  role: AriaRoles.MenuItemCheckBox,
  ariaChecked: true,
  tabIndex: -1,
  childCount: 2,
}

const disabled = {
  type: VirtualDomElements.Div,
  className: ClassNames.MenuItem,
  role: AriaRoles.MenuItem,
  tabIndex: -1,
  disabled: true,
  childCount: 1,
}

const arrowRight = {
  type: VirtualDomElements.Div,
  className: ClassNames.MenuItemSubMenuArrowRight,
  childCount: 0,
}

const getMenuItemSeparatorDom = (menuItem) => {
  return [separator, separatorLine]
}

const getMenuItemCheckedDom = (menuItem) => {
  const { label } = menuItem
  return [
    checkboxChecked,
    {
      type: VirtualDomElements.Div,
      className: 'MenuItemCheckmarkIcon MaskIconCheck',
    },
    text(label),
  ]
}

const getMenuItemUncheckedDom = (menuItem) => {
  const { label } = menuItem
  return [checkboxUnchecked, text(label)]
}

const getMenuItemDisabledDom = (menuItem) => {
  const { label } = menuItem
  return [disabled, text(label)]
}

const getMenuItemDefaultDom = (menuItem) => {
  const { label, isFocused, key } = menuItem
  let className = ClassNames.MenuItem
  if (isFocused) {
    className += ' ' + ClassNames.MenuItemFocused
  }
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className,
      role: AriaRoles.MenuItem,
      tabIndex: -1,
      childCount: 1,
    },
    text(label),
  )
  if (key) {
    dom[0].childCount++
    const parsedKey = ParseKey.parseKey(key)
    let fullText = ''
    if (parsedKey.isCtrl) {
      fullText += 'Ctrl+'
    }
    if (parsedKey.isShift) {
      fullText += 'Shift+'
    }
    if (parsedKey.key) {
      fullText += parsedKey.key.toUpperCase()
    }
    dom.push(
      {
        type: VirtualDomElements.Span,
        className: 'MenuItemKeyBinding',
        childCount: 1,
      },
      text(fullText),
    )
  }
  return dom
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
      childCount: 2,
    },
    text(label),
    arrowRight,
  ]
}

const getMenuItemVirtualDom = (menuItem) => {
  const { flags } = menuItem
  switch (flags) {
    case MenuItemFlags.None:
    case MenuItemFlags.RestoreFocus:
    case MenuItemFlags.Ignore:
      return getMenuItemDefaultDom(menuItem)
    case MenuItemFlags.Separator:
      return getMenuItemSeparatorDom(menuItem)
    case MenuItemFlags.Checked:
      return getMenuItemCheckedDom(menuItem)
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
