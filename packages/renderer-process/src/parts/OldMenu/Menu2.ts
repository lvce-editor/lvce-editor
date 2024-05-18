import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as FindIndex from '../FindIndex/FindIndex.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Widget from '../Widget/Widget.ts'

export const state = {
  $$Menus: [],
}

const create$MenuItem = (item) => {
  return null
}

const handleMouseDown = (event) => {
  const $Target = event.target
  const $Menu = $Target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, $Target)
  if (index === -1) {
    return
  }
  // @ts-expect-error
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
  // @ts-expect-error
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
  // @ts-expect-error
  state.$$Menus.push($Menu)
}

export const closeUntil = (untilIndex) => {
  while (state.$$Menus.length > untilIndex) {
    const $Menu = state.$$Menus.pop()
    Widget.remove($Menu)
  }
}
