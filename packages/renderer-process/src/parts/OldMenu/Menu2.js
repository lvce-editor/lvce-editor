import * as FindIndex from '../../shared/findIndex.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Widget from '../Widget/Widget.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Logger from '../Logger/Logger.js'

export const state = {
  $$Menus: [],
}

const create$MenuItem = (item) => {
  const $MenuItem = document.createElement('li')
  switch (item.flags) {
    case MenuItemFlags.None:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = item.label
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
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.Unchecked:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItemCheckBox
      $MenuItem.ariaChecked = 'false'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      break
    case MenuItemFlags.SubMenu:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      $MenuItem.ariaHasPopup = 'true'
      $MenuItem.ariaExpanded = 'false'
      break
    case MenuItemFlags.Disabled:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      $MenuItem.setAttribute('disabled', 'true')
      break
    default:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = AriaRoles.MenuItem
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      Logger.warn(`invalid menu item flags: "${item.flags}"`)
      break
  }
  return $MenuItem
}

const handleMouseDown = (event) => {
  const $Target = event.target
  const $Menu = $Target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, $Target)
  if (index === -1) {
    return
  }
  const menuIndex = state.$$Menus.indexOf($Menu)
  RendererWorker.send(/* Menu.handleClick */ 'Menu.selectIndex', /* menuIndex */ menuIndex, /* index */ index)
}

const handleMouseEnter = (event) => {
  const $Target = event.target
  const $Menu = $Target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, $Target)
  if (index === -1) {
    return
  }
  const level = state.$$Menus.indexOf($Menu)
  RendererWorker.send(/* Menu.handleMouseEnter */ 'Menu.handleMouseEnter', /* level */ level, /* index */ index)
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} level
 * @param {any[]} items
 */
export const show = (x, y, level, items) => {
  // TODO set aria label on menu (e.g. File, Edit, Selection)
  const $Menu = document.createElement('ul')
  $Menu.className = 'Menu'
  // @ts-ignore
  $Menu.role = AriaRoles.Menu
  $Menu.tabIndex = -1
  $Menu.addEventListener(DomEventType.MouseDown, handleMouseDown)
  $Menu.addEventListener(DomEventType.MouseEnter, handleMouseEnter, {
    capture: true,
  })
  $Menu.style.left = `${x}px`
  $Menu.style.top = `${y}px`
  $Menu.dataset.id = `menu-${level}`
  $Menu.append(...items.map(create$MenuItem))
  state.$$Menus.push($Menu)
}

export const closeUntil = (untilIndex) => {
  while (state.$$Menus.length > untilIndex) {
    const $Menu = state.$$Menus.pop()
    Widget.remove($Menu)
  }
}
