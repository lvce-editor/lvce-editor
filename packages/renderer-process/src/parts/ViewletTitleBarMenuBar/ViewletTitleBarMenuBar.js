import * as Assert from '../Assert/Assert.js'
import * as ViewletTitleBarMenuBarEvents from './ViewletTitleBarMenuBarEvents.js'
import * as Menu from '../OldMenu/Menu.js'
import * as Widget from '../Widget/Widget.js'
import * as MenuItem from '../MenuItem/MenuItem.js'

export const create = () => {
  const $TitleBarMenuBar = document.createElement('div')
  $TitleBarMenuBar.id = 'TitleBarMenuBar'
  // @ts-ignore
  $TitleBarMenuBar.role = 'menubar'
  $TitleBarMenuBar.onkeydown = ViewletTitleBarMenuBarEvents.handleKeyDown
  $TitleBarMenuBar.onmousedown = ViewletTitleBarMenuBarEvents.handleClick
  $TitleBarMenuBar.addEventListener(
    'focusout',
    ViewletTitleBarMenuBarEvents.handleFocusOut
  )

  return {
    $Viewlet: $TitleBarMenuBar,
    $TitleBarMenuBar,
    $$Menus: [],
  }
}

export const dispose = (state) => {}

export const focus = (state) => {
  const { $TitleBarMenuBar } = state
  $TitleBarMenuBar.firstChild.focus()
}

// TODO set proper tabIndex 0 to focused item https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html

// TODO screenreader doesn't read top level label
// when menu is open,
// first item is selected,
// right is clicked it just reads
// "Expanded" instead of "Selection Expanded"

// TODO sometimes screenreader reads too much (e.g. "File, expanded, opens menu, expanded")

// TODO don't focus on separators

// TODO don't focus on hover
// only focus on hover when it has already focus or the menu has focus

// TODO title bar menu bar is very inefficient:

// before: 5 times recalculate style
// 1.37ms Recalculate style
// 83us Update Layer tree
// 0.34ms paint
// 0.79ms composite layer
// 0.23ms Hit test
// 1.42ms Recalculate style
// 1.44ms Recalculate style
// 2.08ms Recalculate style
// 0.44ms Recalculate style
// 0.52ms Layout
// 0.16ms Update Layer Tree
// 48us hit test
// 16us Update Layer Tree
// 0.36ms paint
// 0.33ms composite layer

// now: 2 recalculate styles
// 0.43ms recalculate style
// 0.53ms recalculate style
// 0.19ms layout
// 0.16ms update layer tree
// 30us hit test
// 17us update layer tree
// 0.17ms paint
// 0.19ms composite layers

const create$TopLevelEntry = (item) => {
  const $TitleBarTopLevelEntry = document.createElement('div')
  $TitleBarTopLevelEntry.className = 'TitleBarTopLevelEntry'
  $TitleBarTopLevelEntry.tabIndex = -1
  $TitleBarTopLevelEntry.ariaHasPopup = 'true'
  $TitleBarTopLevelEntry.ariaExpanded = 'false'
  // @ts-ignore
  $TitleBarTopLevelEntry.role = 'menuitem'
  if (item.keyboardShortCut) {
    $TitleBarTopLevelEntry.ariaKeyShortcuts = item.keyboardShortCut
  }
  $TitleBarTopLevelEntry.textContent = item.name
  $TitleBarTopLevelEntry.id = `MenuItem-${item.id}`
  return $TitleBarTopLevelEntry
}

export const getMenuEntryBounds = (state, index) => {
  const { $TitleBarMenuBar } = state
  const $MenuEntry = $TitleBarMenuBar.children[index]
  const rect = $MenuEntry.getBoundingClientRect()
  return {
    left: rect.left,
    bottom: rect.bottom,
  }
}

export const setFocusedIndex = (state, unFocusIndex, focusIndex) => {
  Assert.object(state)
  Assert.number(unFocusIndex)
  Assert.number(focusIndex)
  const { $TitleBarMenuBar } = state
  if (unFocusIndex !== -1) {
    $TitleBarMenuBar.children[unFocusIndex].ariaExpanded = 'false'
    $TitleBarMenuBar.children[unFocusIndex].removeAttribute('aria-owns')
  }
  if (focusIndex !== -1) {
    $TitleBarMenuBar.children[focusIndex].focus()
  }
}

// TODO the focus variable is confusing: false means keep focus in menubar, true means focus the menu
export const openMenu = (
  state,
  unFocusIndex,
  index,
  level,
  menuItems,
  menuFocusedIndex,
  focus,
  x,
  y,
  width,
  height
) => {
  Assert.object(state)
  Assert.number(unFocusIndex)
  Assert.number(index)
  Assert.number(level)
  Assert.array(menuItems)
  Assert.number(menuFocusedIndex)
  Assert.boolean(focus)
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  const { $TitleBarMenuBar } = state
  // TODO this code is very unclean
  $TitleBarMenuBar.addEventListener(
    'mouseenter',
    ViewletTitleBarMenuBarEvents.handleMouseEnter,
    {
      capture: true,
    }
  )
  if (unFocusIndex !== -1) {
    $TitleBarMenuBar.children[unFocusIndex].ariaExpanded = 'false'
    $TitleBarMenuBar.children[unFocusIndex].removeAttribute('aria-owns')
  }
  $TitleBarMenuBar.children[index].ariaExpanded = 'true'
  const $$Menus = Menu.state.$$Menus
  Menu.state.$$Menus = []
  Menu.showControlled({
    x,
    y,
    width,
    height,
    items: menuItems,
    handleKeyDown: ViewletTitleBarMenuBarEvents.handleKeyDown,
    handleFocusOut: ViewletTitleBarMenuBarEvents.handleFocusOut,
    $Parent: $TitleBarMenuBar.children[index],
    level,
  })
  if (menuFocusedIndex !== -1) {
    Menu.focusIndex(0, -1, menuFocusedIndex)
  }
  for (const $Menu of $$Menus) {
    Widget.remove($Menu)
  }
}

// TODO there need to be two variants of closeMenu: one just closes menu, another close menu and focuses top level entry
export const closeMenu = (state, unFocusIndex, index) => {
  const { $TitleBarMenuBar } = state
  if (unFocusIndex !== -1) {
    $TitleBarMenuBar.children[unFocusIndex].ariaExpanded = 'false'
    $TitleBarMenuBar.children[unFocusIndex].removeAttribute('aria-owns')
  }
  if (index !== -1) {
    $TitleBarMenuBar.children[index].focus()
  }
  Menu.hide(/* restoreFocus */ false)
  $TitleBarMenuBar.removeEventListener(
    'mouseenter',
    ViewletTitleBarMenuBarEvents.handleMouseEnter,
    {
      capture: true,
    }
  )
}

export const setEntries = (state, titleBarEntries) => {
  const { $TitleBarMenuBar } = state
  $TitleBarMenuBar.append(...titleBarEntries.map(create$TopLevelEntry))
}

const create$Menu = () => {
  const $Menu = document.createElement('div')
  $Menu.className = 'Menu'
  // @ts-ignore
  $Menu.role = 'menu'
  $Menu.tabIndex = -1
  $Menu.onkeydown = ViewletTitleBarMenuBarEvents.handleKeyDown
  // $ContextMenu.onmousedown = contextMenuHandleMouseDown
  // TODO mousedown vs click? (click is usually better but mousedown is faster, why wait 100ms?)
  // $Menu.addEventListener('mousedown', handleMouseDown)
  // $Menu.addEventListener('mouseenter', handleMouseEnter, {
  //   capture: true,
  // })
  // $Menu.addEventListener('mouseleave', handleMouseLeave, {
  //   capture: true,
  // })
  // $Menu.addEventListener('mousemove', handleMouseMove, {
  //   passive: true,
  // })
  // $Menu.onkeydown = handleKeyDown
  // $Menu.addEventListener('focusout', handleFocusOut)
  // $Menu.oncontextmenu = handleContextMenu
  // $ContextMenu.onfocus = handleFocus
  // $ContextMenu.onblur = handleBlur
  return $Menu
}

// TODO recycle menus
export const setMenus = (state, menus) => {
  const { $$Menus } = state
  for (const $Menu of $$Menus) {
    Widget.remove($Menu)
  }
  const $$NewMenus = []
  for (const menu of menus) {
    const $Menu = create$Menu()
    const { top, left, width, height, level, focusedIndex } = menu
    $Menu.style.width = `${width}px`
    $Menu.style.height = `${height}px`
    $Menu.style.top = `${top}px`
    $Menu.style.left = `${left}px`
    $Menu.append(...menu.items.map(MenuItem.create$MenuItem))
    $Menu.id = `Menu-${level}`
    $$NewMenus.push($Menu)
    Widget.append($Menu)
    if (focusedIndex !== -1) {
      const $Child = $Menu.children[focusedIndex]
      // @ts-ignore
      $Child.focus()
    }
  }
  state.$$Menus = $$NewMenus
}
