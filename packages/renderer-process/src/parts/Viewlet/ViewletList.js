import * as FindIndex from '../../shared/findIndex.js'
import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

export const name = 'List'

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* ViewletExtensions.handleWheel */ 873,
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* ViewletExtensions.handleWheel */ 873,
        /* deltaY */ event.deltaY
      )
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
    window.addEventListener('mousemove', handleScrollBarThumbMouseMove)
    window.addEventListener('mouseup', handleScrollBarThumbMouseUp)
  } else {
    const y = event.clientY
    console.log({ y })
    RendererWorker.send(/* ViewletList.handleScrollBarClick */ 878, /* y */ y)
  }
}

const handleScrollBarThumbMouseMove = (event) => {
  const y = event.clientY
  RendererWorker.send(/* ViewletList.handleScrollBarMouseMove */ 877, /* y */ y)
}

const handleScrollBarThumbMouseUp = () => {
  window.removeEventListener('mousemove', handleScrollBarThumbMouseMove)
  window.removeEventListener('mouseup', handleScrollBarThumbMouseUp)
}

export const create = ({ create$ListItem, render$ListItem, handleClick }) => {
  const $List = document.createElement('div')
  $List.className = 'ExtensionList'
  $List.tabIndex = 0
  $List.ariaLabel = 'Extensions'
  // @ts-ignore
  $List.role = 'list'
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
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'List'
  $Viewlet.append($List, $ScrollBar)
  $Viewlet.addEventListener('wheel', handleWheel, { passive: true })

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
    console.log($List)
    $List.children[oldFocusedIndex].classList.remove('Focused')
  }
  if (newFocusedIndex === -1) {
    $List.removeAttribute('aria-activedescendant')
    $List.classList.add('FocusOutline')
  } else {
    $List.setAttribute(
      'aria-activedescendant',
      $List.children[newFocusedIndex].id
    )
    $List.classList.remove('FocusOutline')
    $List.children[newFocusedIndex].classList.add('Focused')
  }
}

const render$ListLess = ({
  $List,
  create$ListItem,
  render$ListItem,
  items,
}) => {
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
    // console.log('RENDER LESS')
    render$ListLess(state)
  } else if ($List.children.length === items.length) {
    // console.log('RENDER EQUAL')
    render$ListEqual(state)
  } else {
    // console.log('RENDER MORE')
    render$ListMore(state)
  }
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $List } = state
  $List.style.top = `${negativeMargin}px`
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
  $ExtensionList.style.height = `${height}px`
}

export const setScrollBar = (state, scrollBarY, scrollBarHeight) => {
  const { $ScrollBarThumb } = state
  $ScrollBarThumb.style.top = `${scrollBarY}px`
  $ScrollBarThumb.style.height = `${scrollBarHeight}px`
}
