import * as FindIndex from '../../shared/findIndex.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Widget from '../Widget/Widget.js'

export const state = {
  $$Menus: [],
}

const create$MenuItem = (item) => {
  const $MenuItem = document.createElement('li')
  switch (item.flags) {
    case /* None */ 0:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      break
    case /* Separator */ 1:
      $MenuItem.className = 'MenuItemSeparator'
      // @ts-ignore
      $MenuItem.role = 'separator'
      break
    case /* Checked */ 2:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitemcheckbox'
      $MenuItem.ariaChecked = 'true'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      break
    case /* UnChecked */ 3:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitemcheckbox'
      $MenuItem.ariaChecked = 'false'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      break
    case /* SubMenu */ 4:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      $MenuItem.ariaHasPopup = 'true'
      $MenuItem.ariaExpanded = 'false'
      break
    case /* Disabled */ 5:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      $MenuItem.setAttribute('disabled', 'true')
      break
    default:
      $MenuItem.className = 'MenuItem'
      // @ts-ignore
      $MenuItem.role = 'menuitem'
      $MenuItem.textContent = item.label
      $MenuItem.tabIndex = -1
      console.warn(`invalid menu item flags: "${item.flags}"`)
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
  RendererWorker.send(
    /* Menu.handleClick */ 'Menu.selectIndex',
    /* menuIndex */ menuIndex,
    /* index */ index
  )
}

const handleMouseEnter = (event) => {
  const $Target = event.target
  const $Menu = $Target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, $Target)
  if (index === -1) {
    return
  }
  const level = state.$$Menus.indexOf($Menu)
  RendererWorker.send(
    /* Menu.handleMouseEnter */ 'Menu.handleMouseEnter',
    /* level */ level,
    /* index */ index
  )
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
  $Menu.role = 'menu'
  $Menu.tabIndex = -1
  $Menu.addEventListener('mousedown', handleMouseDown)
  $Menu.addEventListener('mouseenter', handleMouseEnter, {
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
