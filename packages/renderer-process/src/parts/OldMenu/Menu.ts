import * as FindIndex from '../FindIndex/FindIndex.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as BackDrop from '../BackDrop/BackDrop.ts'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as Event from '../Event/Event.ts'
import * as Focus from '../Focus/Focus.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as Widget from '../Widget/Widget.ts'
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

export const state = {
  handleKeyDown(event) {},
  handleFocusOut(event) {},
  $$Menus: [],
  anchorX: 0,
  anchorY: 0,
  anchorTime: -1,
  $BackDrop: undefined,
}

const getLevel = ($Menu) => {
  return state.$$Menus.indexOf($Menu)
}

const handleMouseDown = (event) => {
  const $Target = event.target
  const $Menu = $Target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, $Target)
  if (index === -1) {
    return
  }
  Event.preventDefault(event)
  const level = getLevel($Menu)
  RendererWorker.send(/* Menu.handleClick */ 'Menu.selectIndex', /* level */ level, /* index */ index)
}

// const handleKeyDown = (event) => {
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
const handleMouseEnter = (event) => {
  const { target, clientX, clientY, timeStamp } = event
  // @ts-ignore
  const $Menu = target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, target)
  if (index === -1) {
    return
  }
  const level = getLevel($Menu)
  RendererWorker.send(
    /* Menu.handleMouseEnter */ 'Menu.handleMouseEnter',
    /* level */ level,
    /* index */ index,
    /* x */ clientX,
    /* y */ clientY,
    /* timeStamp */ timeStamp,
  )
}

const handleMouseMove = (event) => {
  // const x = event.clientX
  // const y = event.clientY
}

const handleMouseLeave = (event) => {
  const $RelatedTarget = event.relatedTarget
  if ($RelatedTarget.classList.contains('MenuItem')) {
  }
  // RendererWorker.send(/* Menu.handleMouseLeave */ 'Menu.handleMouseLeave')
}

// const handleBlur = (event) => {}
const handleKeyDown = (event) => {
  state.handleKeyDown(event)
}

const handleFocusOut = (event) => {
  state.handleFocusOut(event)
}

const create$Menu = () => {
  // TODO set aria label on menu (e.g. File, Edit, Selection)
  const $Menu = document.createElement('ul')
  $Menu.className = 'Menu'
  $Menu.role = AriaRoles.Menu
  $Menu.tabIndex = -1
  // $ContextMenu.onmousedown = contextMenuHandleMouseDown
  // TODO mousedown vs click? (click is usually better but mousedown is faster, why wait 100ms?)
  $Menu.addEventListener(DomEventType.MouseDown, handleMouseDown)
  $Menu.addEventListener(DomEventType.MouseEnter, handleMouseEnter, {
    capture: true,
  })
  $Menu.addEventListener(DomEventType.MouseLeave, handleMouseLeave, {
    capture: true,
  })
  // $Menu.addEventListener('mousemove', handleMouseMove, {
  //   passive: true,
  // })
  $Menu.onkeydown = handleKeyDown
  $Menu.addEventListener(DomEventType.FocusOut, handleFocusOut)
  $Menu.oncontextmenu = handleContextMenu
  // $ContextMenu.onfocus = handleFocus
  // $ContextMenu.onblur = handleBlur
  return $Menu
}

export const focusIndex = (level, oldFocusedIndex, newFocusedIndex) => {
  const $Menu = state.$$Menus[level]
  if (oldFocusedIndex !== -1) {
    $Menu.children[oldFocusedIndex].classList.remove('MenuItemFocused')
  }
  if (newFocusedIndex !== -1) {
    const $New = $Menu.children[newFocusedIndex]
    if ($New.classList.contains('MenuItemSeparator')) {
      return
    }
    $New.classList.add('MenuItemFocused')
    $New.focus()
  }
}

// TODO replace function that recycles menu dom nodes

const handleBackDropMouseDown = (event) => {
  Event.preventDefault(event)
  Event.stopPropagation(event)
  RendererWorker.send(/* Menu.hide */ 'Menu.hide')
}

const handleContextMenu = (event) => {
  Event.preventDefault(event)
}

export const showMenu = (x, y, width, height, items, level, parentIndex = -1, dom, mouseBlocking = false) => {
  if (mouseBlocking) {
    const $BackDrop = BackDrop.create$BackDrop()
    $BackDrop.onmousedown = handleBackDropMouseDown
    $BackDrop.oncontextmenu = handleContextMenu
    state.$BackDrop = $BackDrop
    Widget.append($BackDrop)
  }

  const $Menu = create$Menu()
  VirtualDom.renderInto($Menu, dom)
  SetBounds.setXAndY($Menu, x, y)
  $Menu.id = `Menu-${level}`

  if (parentIndex !== -1) {
    const $ParentMenu = state.$$Menus[level - 1]
    const $ParentMenuItem = $ParentMenu.children[parentIndex]
    $ParentMenuItem.ariaExpanded = AriaBoolean.True
    $ParentMenuItem.setAttribute(DomAttributeType.AriaOwns, $Menu.id)
  }

  state.$$Menus.push($Menu)
  Widget.append($Menu)

  if (level === 0) {
    Focus.focus($Menu)
    RendererWorker.send('Focus.setFocus', WhenExpression.FocusMenu)
  }
}

export const closeSubMenu = () => {
  const $SubMenu = state.$$Menus.pop()
  const $ParentMenu = state.$$Menus.at(-1)
  Widget.remove($SubMenu)
}

export const hideSubMenu = (level) => {
  const $$ChildMenus = state.$$Menus.slice(level)
  for (const $ChildMenu of $$ChildMenus) {
    Widget.remove($ChildMenu)
  }
}

// export const showSubMenu = (level, items, parentIndex) => {
//   const $$ChildMenus = state.$$Menus.slice(level)
//   for (const $ChildMenu of $$ChildMenus) {
//     Widget.remove($ChildMenu)
//   }
//   state.$$Menus = state.$$Menus.slice(0, level)
//   const $ParentMenu = state.$$Menus[level - 1]
//   const $ParentMenuItem = $ParentMenu.children[parentIndex]
//   const rect = $ParentMenuItem.getBoundingClientRect()
//   const x = rect.right
//   const y = rect.top
//   showMenu(x, y, items, level)
//   // TODO remove aria-owns when sub-menu is closed
//   $ParentMenuItem.setAttribute('aria-owns', 'Menu')
// }

// TODO implement focusIndex like this
// const focusIndex2=(id, index)=>{
//   const $Menu = state.menus[id]
//   $Menu.children[index].focus()
// }

// TODO support nested menus / submenus
export const showControlled = ({ x, y, items, handleKeyDown, handleFocusOut, $Parent, level, width, height }) => {
  // @ts-ignore
  showMenu(x, y, width, height, items, level)
  // TODO menu should not necessarily know about parent (titleBarMenuBar)
  // it should be the other way around
  // @ts-ignore
  state.$Parent = $Parent
  state.handleFocusOut = handleFocusOut
  state.handleKeyDown = handleKeyDown
  if ($Parent) {
    // state.$Menu.ariaLabel=''
    // state.$Menu.ariaLabelledBy  =$Parent.id
    $Parent.setAttribute(DomAttributeType.AriaOwns, 'Menu')
  } else {
    // state.$Menu.removeAttribute('aria-labelledby')
  }
  // Context.setFocus('menu') // TODO overlapping focus: titleBarMenuBar has focus (kinda) but also menu at the same time
}

// TODO have function to show submenu

export const hide = (restoreFocus = true) => {
  for (const $Menu of state.$$Menus) {
    Widget.remove($Menu)
  }
  state.$$Menus = []
  if (state.$BackDrop) {
    Widget.remove(state.$BackDrop)
    state.$BackDrop = undefined
  }
  // TODO focus previous item
  if (restoreFocus) {
    Focus.focusPrevious()
  }
}

export const contains = ($Element) => {
  for (const $Menu of state.$$Menus) {
    if ($Menu.contains($Element)) {
      return true
    }
  }
  return false
}
