import * as Menu from '../OldMenu/Menu.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Widget from '../Widget/Widget.js'
import * as Assert from '../Assert/Assert.js'

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
  const $TitleBarTopLevelEntry = document.createElement('li')
  $TitleBarTopLevelEntry.className = 'TitleBarTopLevelEntry'
  $TitleBarTopLevelEntry.tabIndex = -1
  $TitleBarTopLevelEntry.ariaHasPopup = 'true'
  $TitleBarTopLevelEntry.ariaExpanded = 'false'
  $TitleBarTopLevelEntry.setAttribute('role', 'menuitem') // TODO use idl once supported by chrome
  if (item.keyboardShortCut) {
    $TitleBarTopLevelEntry.ariaKeyShortcuts = item.keyboardShortCut
  }
  $TitleBarTopLevelEntry.textContent = item.name
  $TitleBarTopLevelEntry.dataset.id = item.id
  $TitleBarTopLevelEntry.id = `MenuItem-${item.id}`
  return $TitleBarTopLevelEntry
}

export const getMenuEntryBounds = (state, index) => {
  const $MenuEntry = state.$TitleBarMenu.children[index]
  const rect = $MenuEntry.getBoundingClientRect()
  return {
    left: rect.left,
    bottom: rect.bottom,
  }
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'TitleBarTopLevelEntry':
      return getNodeIndex($Target)
    default:
      return -1
  }
}

const handleClick = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  // event.preventDefault()
  RendererWorker.send([/* TitleBarMenu.handleClick */ 4610, /* index */ index])
}

export const focusIndex = (state, unFocusIndex, index) => {
  Assert.object(state)
  Assert.number(unFocusIndex)
  Assert.number(focusIndex)
  console.log('FOCUS ONE')
  console.log({ unFocusIndex, index })
  const $TitleBarMenu = state.$TitleBarMenu
  if (unFocusIndex !== -1) {
    $TitleBarMenu.children[unFocusIndex].ariaExpanded = 'false'
    $TitleBarMenu.children[unFocusIndex].removeAttribute('aria-owns')
  }
  $TitleBarMenu.children[index].focus()
}

const handleMouseEnter = (event) => {
  const $Target = event.target
  const index = getIndex($Target)
  if (index === -1) {
    return
  }
  const enterX = event.clientX
  const enterY = event.clientY
  RendererWorker.send([
    /* TitleBarMenu.focusIndex */ 4613,
    /* index */ index,
    /* enterX */ enterX,
    /* enterY */ enterY,
  ])
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
  // TODO this code is very unclean
  state.$TitleBarMenu.addEventListener('mouseenter', handleMouseEnter, {
    capture: true,
  })
  if (unFocusIndex !== -1) {
    state.$TitleBarMenu.children[unFocusIndex].ariaExpanded = 'false'
    state.$TitleBarMenu.children[unFocusIndex].removeAttribute('aria-owns')
  }
  state.$TitleBarMenu.children[index].ariaExpanded = 'true'
  const $$Menus = Menu.state.$$Menus
  Menu.state.$$Menus = []
  Menu.showControlled({
    x,
    y,
    width,
    height,
    items: menuItems,
    handleKeyDown,
    handleFocusOut,
    $Parent: state.$TitleBarMenu.children[index],
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
  if (unFocusIndex !== -1) {
    state.$TitleBarMenu.children[unFocusIndex].ariaExpanded = 'false'
    state.$TitleBarMenu.children[unFocusIndex].removeAttribute('aria-owns')
  }
  if (index !== -1) {
    state.$TitleBarMenu.children[index].focus()
  }
  Menu.hide(/* restoreFocus */ false)
  state.$TitleBarMenu.removeEventListener('mouseenter', handleMouseEnter, {
    capture: true,
  })
}

// TODO should only have the one listener in KeyBindings.js
const handleKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyArrowDown */ 4618])
      break
    case 'ArrowUp':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyArrowUp */ 4619])
      break
    case 'ArrowRight':
      console.log('arrow right')
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyArrowRight */ 4620])
      break
    case 'ArrowLeft':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyArrowLeft */ 4626])
      break
    case 'Enter':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyEnter */ 4624])
      break
    case ' ':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeySpace */ 4623])
      break
    case 'Home':
    case 'PageUp':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyHome */ 4621])
      break
    case 'End':
    case 'PageDown':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyEnd */ 4622])
      break
    case 'Escape':
      event.preventDefault()
      event.stopPropagation()
      RendererWorker.send([/* TitleBarMenu.handleKeyEscape */ 4625])
      break
    default:
      break
  }
}

const isInsideTitleBarMenu = ($Element) => {
  return (
    $Element.classList.contains('MenuItem') ||
    $Element.classList.contains('Menu')
  )
}

const handleFocusOut = (event) => {
  const $ActiveElement = event.relatedTarget
  if ($ActiveElement && isInsideTitleBarMenu($ActiveElement)) {
    console.log('RETURN')
    return
  }
  RendererWorker.send([
    /* TitleBarMenu.closeMenu */ 4616,
    /* keepFocus */ false,
  ])
}

export const create = () => {
  const $TitleBarMenu = document.createElement('ul')
  $TitleBarMenu.id = 'TitleBarMenu'
  $TitleBarMenu.setAttribute('role', 'menubar')
  $TitleBarMenu.onkeydown = handleKeyDown
  // TODO could have one mousedown listener on titlebar that delegates to titlebarMenu if necessary
  $TitleBarMenu.onmousedown = handleClick
  $TitleBarMenu.addEventListener('focusout', handleFocusOut)
  return $TitleBarMenu
}

export const setEntries = (state, titleBarEntries) => {
  const $TitleBarMenu = state.$TitleBarMenu
  $TitleBarMenu.append(...titleBarEntries.map(create$TopLevelEntry))
}
