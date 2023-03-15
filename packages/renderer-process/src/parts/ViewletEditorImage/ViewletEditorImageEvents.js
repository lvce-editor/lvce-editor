import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Focus from '../Focus/Focus.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletEditorImageFunctions from './ViewletEditorImageFunctions.js'
import * as Event from '../Event/Event.js'

/**
 * @param {PointerEvent} event
 */
export const handlePointerMove = (event) => {
  const { pointerId, clientX, clientY } = event
  ViewletEditorImageFunctions.handlePointerMove(pointerId, clientX, clientY)
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerUp = (event) => {
  const { pointerId, clientX, clientY, target, button } = event
  if (button !== MouseEventType.LeftClick) {
    return
  }
  ViewletEditorImageFunctions.handlePointerUp(pointerId, clientX, clientY)
}

export const handlePointerCaptureLost = (event) => {
  const { target } = event
  // @ts-ignore
  target.removeEventListener(DomEventType.PointerMove, handlePointerMove)
  // @ts-ignore
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
  ViewletEditorImageFunctions.handlePointerDown(pointerId, clientX, clientY)
}

/**
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { clientX, clientY, deltaX, deltaY } = event
  ViewletEditorImageFunctions.handleWheel(clientX, clientY, deltaX, deltaY)
}

/**
 *
 * @param {MouseEvent} event
 */
export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  ViewletEditorImageFunctions.handleContextMenu(button, clientX, clientY)
}

export const handleError = (event) => {
  ViewletEditorImageFunctions.handleImageError()
}

export const handleFocus = () => {
  Focus.setFocus('EditorImage')
}
