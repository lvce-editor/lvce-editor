import * as FindIndex from '../../shared/findIndex.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as Widget from '../Widget/Widget.js'
import * as MenuItem from '../MenuItem/MenuItem.js'
import * as BackDrop from '../BackDrop/BackDrop.js'
import * as Focus from '../Focus/Focus.js'

// TODO when pressing tab -> focus next element in tab order and close menu

// TODO menu and contextmenu should have own keybinding logic
// seems not possible to do with just one keybinding listener

// TODO similar to context menu, show sub menu entries
// there can be multiple instances (parent -> child -> child) submenus

// TODO using .style.top, .style.left causes chrome devtools to show many layout shift -> maybe use transform instead

// TODO when cycling through items, recalculate style is much slower
// than in vscode (1.49ms vs 0.33ms)
// paint is also faster in vscode (0.32ms vs 0.14ms)

// TODO focus on menu is not announced to screenreader

// TODO recalculate style and paint is slow when cycling through items:
// 0.59ms recalculate style
// 36us update layer tree
// 0.35ms paint
// 0.20ms composite layer

// const contextMenuWidth = 150
// const contextMenuHeight = 150 + /* padding */ 8 * 4

// TODO keyboard handling

export const create = () => {
  // TODO set aria label on menu (e.g. File, Edit, Selection)
  const $Menu = document.createElement('ul')
  $Menu.className = 'Menu'
  $Menu.setAttribute('role', 'menu')
  $Menu.tabIndex = -1
  // $ContextMenu.onmousedown = contextMenuHandleMouseDown
  // TODO mousedown vs click? (click is usually better but mousedown is faster, why wait 100ms?)
  $Menu.onmousedown = handleMouseDown
  $Menu.onmouseover = handleMouseOver
  // $Menu.addEventListener('mouseleave', handleMouseLeave)
  // $Menu.addEventListener('mousemove', handleMouseMove, {
  //   passive: true,
  // })
  $Menu.oncontextmenu = handleContextMenu
  // $ContextMenu.onfocus = handleFocus
  // $ContextMenu.onblur = handleBlur
  return {
    $Menu,
  }
}

export const setPosition = (state, x, y) => {
  const { $Menu } = state
  $Menu.style.left = `${x}px`
  $Menu.style.top = `${y}px`
}

export const setItems = (state, items) => {
  console.log('set items', items)
  const { $Menu } = state
  $Menu.append(...items.map(MenuItem.create$MenuItem))
}

export const setFocusedIndex = (state, oldIndex, newIndex) => {
  const { $Menu } = state
  if (oldIndex !== -1) {
    const $OldItem = $Menu.children[oldIndex]
    $OldItem.classList.remove('Focused')
  }
  if (newIndex === -1) {
    $Menu.removeAttribute('aria-activedescendant')
  } else {
    const $NewItem = $Menu.children[newIndex]
    $NewItem.classList.add('Focused')
    $Menu.setAttribute('aria-activedescendant', $NewItem.id) // TODO use idl once supported
  }
}

const handleMouseDown = (event) => {
  const $Target = event.target
  const $Menu = $Target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, $Target)
  if (index === -1) {
    console.log('index is negative one')
    return
  }
  event.preventDefault()
  const level = getLevel($Menu)
  RendererWorker.send(
    /* Menu.handleClick */ 'Menu.selectIndex',
    /* level */ level,
    /* index */ index
  )
}

// const handleKeyDown = (event) => {
//   console.log({ key: event.key })
//   switch (event.key) {
//     case 'ArrowUp':
//       RendererWorker.send( /* Menu.focusPrevious */ 7405)
//       break
//     case 'ArrowLeft':
//       // TODO collapse menu maybe
//       break
//     case 'ArrowDown':
//       RendererWorker.send( /* Menu.focusNext */ 7404)
//       break
//     case 'ArrowRight':
//       // TODO expand sub menu maybe
//       break
//     case 'Home':
//       RendererWorker.send( /* Menu.focusFirst */ 7406)
//       break
//     case 'End':
//       RendererWorker.send( /* Menu.focusLast */ 7407)
//       break
//     default:
//       break
//   }
// }

const MOUSE_LOCS_TRACKED = 3

/**
 *
 * @param {MouseEvent} event
 */
const handleMouseOver = (event) => {
  const $Target = event.target
  // @ts-ignore
  const $Menu = $Target.closest('.Menu')
  const x = event.clientX
  const y = event.clientY
  const timeStamp = event.timeStamp

  const index = FindIndex.findIndex($Menu, $Target)
  console.log({ index })
  if (index === -1) {
    return
  }
  RendererWorker.send(
    /* Menu.handleMouseOver */ 'Menu.handleMouseOver',
    /* index */ index
  )
}

const handleMouseMove = (event) => {
  // const x = event.clientX
  // const y = event.clientY
  // console.log('move', { x, y })
}

const handleMouseLeave = (event) => {
  // const x = event.clientX
  // const y = event.clientY
  // console.log('leave', { x, y })
}

// const handleBlur = (event) => {}
// const handleKeyDown = (event) => {
//   state.handleKeyDown(event)
// }

// const handleFocusOut = (event) => {
//   state.handleFocusOut(event)
// }

const create$Menu = () => {}

export const focusIndex = (level, oldFocusedIndex, newFocusedIndex) => {
  const $Menu = state.$$Menus[level]
  if (oldFocusedIndex !== -1) {
    $Menu.children[oldFocusedIndex].classList.remove('Focused')
  }
  if (newFocusedIndex !== -1) {
    $Menu.children[newFocusedIndex].classList.add('Focused')
    $Menu.children[newFocusedIndex].focus()
  }
}

// TODO replace function that recycles menu dom nodes

const handleBackDropMouseDown = () => {
  RendererWorker.send(/* Menu.hide */ 'Menu.hide')
}

const handleContextMenu = (event) => {
  event.preventDefault()
}
