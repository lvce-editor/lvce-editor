import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as Event from '../Event/Event.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import * as ViewletEditorImageFunctions from './ViewletEditorImageFunctions.js'

/**
 * @param {PointerEvent} event
 */
export const handlePointerMove = (event) => {
  const { pointerId, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handlePointerMove(uid, pointerId, clientX, clientY)
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerUp = (event) => {
  const { pointerId, clientX, clientY, target, button } = event
  if (button !== MouseEventType.LeftClick) {
    return
  }
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handlePointerUp(uid, pointerId, clientX, clientY)
}

export const handlePointerCaptureLost = (event) => {
  const { target } = event
  target.removeEventListener(DomEventType.PointerMove, handlePointerMove)
  target.removeEventListener(DomEventType.PointerUp, handlePointerUp)
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerDown = (event) => {
  const { pointerId, clientX, clientY, target, button } = event
  if (button !== MouseEventType.LeftClick) {
    return
  }
  // @ts-ignore
  target.setPointerCapture(pointerId)
  // @ts-ignore
  target.addEventListener(DomEventType.PointerMove, handlePointerMove, DomEventOptions.Active)
  // @ts-ignore
  target.addEventListener(DomEventType.PointerUp, handlePointerUp)
  target.addEventListener(DomEventType.LostPointerCapture, handlePointerCaptureLost)
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handlePointerDown(uid, pointerId, clientX, clientY)
}

/**
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { clientX, clientY, deltaX, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handleWheel(uid, clientX, clientY, deltaX, deltaY)
}

/**
 *
 * @param {MouseEvent} event
 */
export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handleContextMenu(uid, button, clientX, clientY)
}

export const handleError = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handleImageError(uid)
}

export const handleFocus = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletEditorImageFunctions.handleFocus(uid)
}
