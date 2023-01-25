import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(/* ViewletExtensions.handleWheel */ 873, /* deltaY */ event.deltaY)
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(/* ViewletExtensions.handleWheel */ 873, /* deltaY */ event.deltaY)
      break
    default:
      break
  }
}

const handleContextMenu = (event) => {
  event.preventDefault()
  const $Target = event.target
  // const index = FindIndex.findIndex(state.$Extensions, $Target)
  // if (index === -1) {
  //   return
  // }
  // const extension = state.extensions[index]
  // RendererWorker.send(
  //   /* Extensions.handleContextMenu */ 'Extensions.handleContextMenu',
  //   /* x */ event.clientX,
  //   /* y */ event.clientY,
  //   /* extensionId */ extension.id
  // )
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleFocus = (event) => {
  const $Target = event.target
  $Target.classList.add('FocusOutline')
  // TODO maybe have one focus listener inside Viewlet.js instead of each viewlet
  Focus.setFocus('ViewletList')

  // RendererWorker.send(/* ViewletExtensions.focusIndex */ 868, /* index */ -1)
}

const handleScrollBarMouseDown = (event) => {
  const $Target = event.target
  if ($Target.className === 'ScrollBarThumb') {
    window.addEventListener(DomEventType.MouseMove, handleScrollBarThumbMouseMove)
    window.addEventListener(DomEventType.MouseUp, handleScrollBarThumbMouseUp)
  } else {
    const y = event.clientY
    RendererWorker.send(/* ViewletList.handleScrollBarClick */ 878, /* y */ y)
  }
}

const handleScrollBarThumbMouseMove = (event) => {
  const y = event.clientY
  RendererWorker.send(/* ViewletList.handleScrollBarMouseMove */ 877, /* y */ y)
}

const handleScrollBarThumbMouseUp = () => {
  window.removeEventListener(DomEventType.MouseMove, handleScrollBarThumbMouseMove)
  window.removeEventListener(DomEventType.MouseUp, handleScrollBarThumbMouseUp)
}

export const create = ({ create$ListItem, render$ListItem, handleClick }) => {
  const $List = document.createElement('div')
  $List.className = 'ExtensionList'
  $List.tabIndex = 0
  $List.ariaLabel = 'Extensions'
  // @ts-ignore
  $List.role = AriaRoles.List
  $List.oncontextmenu = handleContextMenu
  $List.onclick = handleClick
  $List.onfocus = handleFocus

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.onmousedown = handleScrollBarMouseDown
  $ScrollBar.append($ScrollBarThumb)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet List'
  $Viewlet.append($List, $ScrollBar)
  $Viewlet.addEventListener(DomEventType.Wheel, handleWheel, DomEventOptions.Passive)

  return {
    $Viewlet,
    $List,
    $ScrollBarThumb,
    create$ListItem,
    render$ListItem,
  }
}

// TODO possibly use aria active descendant instead
export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  Assert.object(state)
  Assert.number(oldFocusedIndex)
  Assert.number(newFocusedIndex)
  const { $List } = state
  if (oldFocusedIndex !== -1) {
    $List.children[oldFocusedIndex].classList.remove('Focused')
  }
  if (newFocusedIndex === -1) {
    $List.removeAttribute(DomAttributeType.AriaActiveDescendant)
    $List.classList.add('FocusOutline')
  } else {
    $List.setAttribute(DomAttributeType.AriaActiveDescendant, $List.children[newFocusedIndex].id)
    $List.classList.remove('FocusOutline')
    $List.children[newFocusedIndex].classList.add('Focused')
  }
}

const render$ListLess = ({ $List, create$ListItem, render$ListItem, items }) => {
  for (let i = 0; i < $List.children.length; i++) {
    render$ListItem($List.children[i], items[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $List.children.length; i < items.length; i++) {
    const $Extension = create$ListItem()
    render$ListItem($Extension, items[i])
    fragment.append($Extension)
  }
  $List.append(fragment)
}

const render$ListEqual = ({ $List, render$ListItem, items }) => {
  for (let i = 0; i < items.length; i++) {
    render$ListItem($List.children[i], items[i])
  }
}

const render$ListMore = ({ $List, render$ListItem, items }) => {
  for (let i = 0; i < items.length; i++) {
    render$ListItem($List.children[i], items[i])
  }
  const diff = $List.children.length - items.length
  for (let i = 0; i < diff; i++) {
    $List.lastChild.remove()
  }
}

const render$List = (state) => {
  const { $List, items } = state
  if ($List.children.length < items.length) {
    render$ListLess(state)
  } else if ($List.children.length === items.length) {
    render$ListEqual(state)
  } else {
    render$ListMore(state)
  }
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $List } = state
  SetBounds.setTop($List, negativeMargin)
  // Assert.number(negativeMargin)
  // const { $NegativeMargin } = state
  // $NegativeMargin.style.marginTop = `${negativeMargin}px`
}

// TODO a more efficient approach would be
export const setItems = (state, items) => {
  Assert.object(state)
  Assert.array(items)
  state.items = items
  render$List(state)
}

export const dispose = (state) => {}

export const setContentHeight = (state, height) => {
  const { $ExtensionList } = state
  SetBounds.setHeight($ExtensionList, height)
}

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  SetBounds.setYAndHeight(scrollBarY, scrollBarHeight)
}
