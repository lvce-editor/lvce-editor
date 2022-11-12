import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* ViewletSearch.handleInput */ 'Search.handleInput',
    /* value */ value
  )
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getIndexTreeItem = ($Target) => {
  return getNodeIndex($Target)
}

const getIndexLabel = ($Target) => {
  return getNodeIndex($Target.parentNode)
}

const getIndex = ($Target) => {
  switch ($Target.className) {
    case 'TreeItem':
      return getIndexTreeItem($Target)
    case 'Label':
      return getIndexLabel($Target)
    default:
      return -1
  }
}

export const handleClick = (event) => {
  const { target, button } = event
  if (button === MouseEventType.RightClick) {
    return
  }
  const index = getIndex(target)
  RendererWorker.send(
    /* Search.handleClick */ 'Search.handleClick',
    /* index */ index
  )
}

const handleContextMenuMouse = (event) => {
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Search.handleContextMenuMouseAt */ 'Search.handleContextMenuMouseAt',
    /* x */ x,
    /* y */ y
  )
}

const handleContextMenuKeyboard = (event) => {
  RendererWorker.send(
    /* Search.handleContextMenuKeyboard */ 'Search.handleContextMenuKeyboard'
  )
}

export const handleContextMenu = (event) => {
  event.preventDefault()
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(
    /* Search.handleScrollBarMouseMove */ 'Search.handleScrollBarMove',
    /* y */ clientY
  )
}

export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  target.releasePointerCapture(pointerId)
  target.removeEventListener('pointermove', handleScrollBarThumbPointerMove)
  target.removeEventListener('pointerup', handleScrollBarPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener('pointermove', handleScrollBarThumbPointerMove, {
    passive: false,
  })
  target.addEventListener('pointerup', handleScrollBarPointerUp)
  RendererWorker.send(
    /* Search.handleScrollBarPointerDown */ 'Search.handleScrollBarClick',
    /* y */ clientY
  )
}

export const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* ViewletSearch.handleWheel */ 'Search.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* ViewletSearch.handleWheel */ 'Search.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    default:
      break
  }
}
