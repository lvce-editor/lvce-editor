import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js'
import * as Icon from '../Icon/Icon.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletExtensionsFunctions from './ViewletExtensionsFunctions.js'

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleScrollBarThumbPointerMove(uid, clientY)
}

const handleScrollBarPointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  target.setPointerCapture(pointerId)
  target.addEventListener(DomEventType.PointerMove, handleScrollBarThumbPointerMove, DomEventOptions.Active)
  target.addEventListener(DomEventType.LostPointerCapture, handleScrollBarPointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleScrollBarClick(uid, clientY)
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

const handlePointerDownExtension = (uid, $Target) => {
  const index = getNodeIndex($Target)
  ViewletExtensionsFunctions.handleClick(uid, index)
}

const handlePointerDownExtensionDetail = (uid, $Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode)
  ViewletExtensionsFunctions.handleClick(index)
}

const handlePointerDownExtensionAuthorName = (uid, $Target) => {
  const index = getNodeIndex($Target.parentNode.parentNode.parentNode)
  ViewletExtensionsFunctions.handleClick(uid, index)
}

export const handlePointerDown = (event) => {
  const { target, button } = event
  const uid = ComponentUid.fromEvent(event)
  if (button !== MouseEventType.LeftClick) {
    return
  }
  switch (target.className) {
    case 'ExtensionListItem':
      handlePointerDownExtension(uid, target)
      break
    case 'ExtensionListItemName':
    case 'ExtensionListItemDescription':
    case 'ExtensionListItemFooter':
      handlePointerDownExtensionDetail(uid, target)
      break
    case 'ExtensionListItemAuthorName':
      handlePointerDownExtensionAuthorName(uid, target)
      break
    default:
      break
  }
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleContextMenu(uid, button, clientX, clientY)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleWheel(uid, deltaMode, deltaY)
}

export const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleInput(uid, value)
  // TODO
  // TODO use beforeinput event to set value and extension list items at the same time
  // state.$Viewlet.ariaBusy = 'true'
}

export const handleIconError = (event) => {
  // TODO send this to renderer worker
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
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleTouchMove(uid, timeStamp, changedTouchesArray)
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchStart = (event) => {
  const { changedTouches, timeStamp } = event
  const changedTouchesArray = toArray(changedTouches)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleTouchStart(uid, timeStamp, changedTouchesArray)
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchEnd = (event) => {
  const { changedTouches } = event
  const changedTouchesArray = toArray(changedTouches)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleTouchEnd(uid, changedTouchesArray)
}
