import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as Icon from '../Icon/Icon.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as PointerEvents from '../PointerEvents/PointerEvents.js'
import * as TouchEvent from '../TouchEvent/TouchEvent.js'
import * as ViewletExtensionsFunctions from './ViewletExtensionsFunctions.js'

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleScrollBarThumbPointerMove(uid, clientY)
}

const handleScrollBarPointerCaptureLost = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleScrollBarThumbPointerMove, handleScrollBarPointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleScrollBarCaptureLost(uid)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  PointerEvents.startTracking(target, pointerId, handleScrollBarThumbPointerMove, handleScrollBarPointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleScrollBarClick(uid, clientY)
}

export const handleFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleFocus(uid)
}

export const handlePointerDown = (event) => {
  const { target, button } = event
  const uid = ComponentUid.fromEvent(event)
  if (button !== MouseEventType.LeftClick) {
    return
  }
  const $Extension = target.closest('.ExtensionListItem')
  const index = GetNodeIndex.getNodeIndex($Extension)
  ViewletExtensionsFunctions.handleClick(uid, index)
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
 * @param {TouchEvent} event
 */
export const handleTouchMove = (event) => {
  const { timeStamp } = event
  const { changedTouches } = TouchEvent.toSimpleTouchEvent(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleTouchMove(uid, timeStamp, changedTouches)
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchStart = (event) => {
  const { timeStamp } = event
  const { changedTouches } = TouchEvent.toSimpleTouchEvent(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleTouchStart(uid, timeStamp, changedTouches)
}

/**
 * @param {TouchEvent} event
 */
export const handleTouchEnd = (event) => {
  const { changedTouches } = TouchEvent.toSimpleTouchEvent(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionsFunctions.handleTouchEnd(uid, changedTouches)
}

export * from '../ContextMenuEvents/ContextMenuEvents.ts'
export * from '../VirtualListEvents/VirtualListEvents.js'
