import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as HandleContextMenu from '../HandleContextMenu/HandleContextMenu.js'
import * as Icon from '../Icon/Icon.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as ViewletExtensionsFunctions from './ViewletExtensionsFunctions.js'

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  RendererWorker.send(/* Extensions.handleScrollBarMouseMove */ 'Extensions.handleScrollBarMove', /* y */ clientY)
}

const handlePointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove, DomEventOptions.Active)
  target.addEventListener(DomEventType.LostPointerCapture, handlePointerCaptureLost)
  ViewletExtensionsFunctions.handleScrollBarClick(clientY)
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
  ViewletExtensionsFunctions.handleClick(index)
}

const handlePointerDownExtensionDetail = ($Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode)
  ViewletExtensionsFunctions.handleClick(index)
}

const handlePointerDownExtensionAuthorName = ($Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode.parentNode)
  ViewletExtensionsFunctions.handleClick(index)
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
  HandleContextMenu.handleContextMenu('Extensions.handleContextMenu', event)
}

const handleContextMenuKeyboard = (event) => {}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
    case WheelEventType.DomDeltaPixel:
      ViewletExtensionsFunctions.handleWheel(deltaY)
      break
    default:
      break
  }
}

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  ViewletExtensionsFunctions.handleInput(value)
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
  ViewletExtensionsFunctions.handleTouchMove(timeStamp, changedTouchesArray)
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchStart = (event) => {
  const { changedTouches, timeStamp } = event
  const changedTouchesArray = toArray(changedTouches)
  ViewletExtensionsFunctions.handleTouchStart(timeStamp, changedTouchesArray)
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchEnd = (event) => {
  const { changedTouches } = event
  const changedTouchesArray = toArray(changedTouches)
  ViewletExtensionsFunctions.handleTouchEnd(changedTouchesArray)
}
