import * as Focus from '../Focus/Focus.js'
import * as Icon from '../Icon/Icon.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(
    /* Extensions.handleScrollBarMouseMove */ 'Extensions.handleScrollBarMove',
    /* y */ clientY
  )
}

const handlePointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener('pointermove', handleScrollBarThumbPointerMove)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener('pointermove', handleScrollBarThumbPointerMove, {
    passive: false,
  })
  target.addEventListener('lostpointercapture', handlePointerCaptureLost)
  RendererWorker.send(
    /* Extensions.handleScrollBarPointerDown */ 'Extensions.handleScrollBarClick',
    /* y */ clientY
  )
}

export const handleFocus = (event) => {
  Focus.setFocus('Extensions')
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handlePointerDownExtension = ($Target) => {
  const index = getNodeIndex($Target)
  RendererWorker.send(
    /* Extensions.handleClick */ 'Extensions.handleClick',
    /* index */ index
  )
}

const handlePointerDownExtensionDetail = ($Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode)
  RendererWorker.send(
    /* Extensions.handleClick */ 'Extensions.handleClick',
    /* index */ index
  )
}

const handlePointerDownExtensionAuthorName = ($Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode.parentNode)
  RendererWorker.send(
    /* Extensions.handleClick */ 'Extensions.handleClick',
    /* index */ index
  )
}

export const handlePointerDown = (event) => {
  const { target, button } = event
  if (button !== MouseEventType.LeftClick) {
    return
  }
  switch (target.className) {
    case 'ExtensionListItem':
      handlePointerDownExtension(target)
      break
    case 'ExtensionListItemName':
    case 'ExtensionListItemDescription':
    case 'ExtensionListItemFooter':
      handlePointerDownExtensionDetail(target)
      break
    case 'ExtensionListItemAuthorName':
      handlePointerDownExtensionAuthorName(target)
      break
    default:
      break
  }
}

const handleContextMenuMouse = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send(
    /* Extensions.handleContextMenu */ 'Extensions.handleContextMenu',
    /* x */ clientX,
    /* y */ clientY
  )
}

const handleContextMenuKeyboard = (event) => {}

export const handleContextMenu = (event) => {
  event.preventDefault()
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}

export const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* ViewletExtensions.handleWheel */ 'Extensions.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* ViewletExtensions.handleWheel */ 'Extensions.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    default:
      break
  }
}

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* ViewletExtensions.handleInput */ 'Extensions.handleInput',
    /* value */ value
  )
  // TODO
  // TODO use beforeinput event to set value and extension list items at the same time
  // state.$Viewlet.ariaBusy = 'true'
}

export const handleIconError = (event) => {
  const $Target = event.target
  if ($Target.src.endsWith(Icon.ExtensionDefaultIcon)) {
    return
  }
  $Target.src = Icon.ExtensionDefaultIcon
}

export const handleScroll = (event) => {}

/**
 *
 * @param {TouchList} touchList
 */
const toArray = (touchList) => {
  const touchArray = []
  // @ts-ignore
  for (const item of touchList) {
    touchArray.push({
      clientX: item.clientX,
      clientY: item.clientY,
      identifier: item.identifier,
    })
  }
  return touchArray
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchMove = (event) => {
  const { changedTouches, timeStamp } = event
  const changedTouchesArray = toArray(changedTouches)
  RendererWorker.send(
    'Extensions.handleTouchMove',
    timeStamp,
    changedTouchesArray
  )
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchStart = (event) => {
  const { changedTouches, timeStamp } = event
  const changedTouchesArray = toArray(changedTouches)
  RendererWorker.send(
    'Extensions.handleTouchStart',
    timeStamp,
    changedTouchesArray
  )
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchEnd = (event) => {
  const { changedTouches } = event
  const changedTouchesArray = toArray(changedTouches)
  RendererWorker.send('Extensions.handleTouchEnd', changedTouchesArray)
}
