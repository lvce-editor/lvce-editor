import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as DomEventType from '../DomEventType/DomEventType.js'

/**
 * @param {PointerEvent} event
 */
export const handlePointerMove = (event) => {
  const { pointerId, clientX, clientY } = event
  RendererWorker.send(
    'EditorImage.handlePointerMove',
    pointerId,
    clientX,
    clientY
  )
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerUp = (event) => {
  const { pointerId, clientX, clientY, target, button } = event
  if (button !== MouseEventType.LeftClick) {
    return
  }
  RendererWorker.send(
    'EditorImage.handlePointerUp',
    pointerId,
    clientX,
    clientY
  )
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
  target.addEventListener(DomEventType.PointerMove, handlePointerMove, {
    passive: false,
  })
  // @ts-ignore
  target.addEventListener(DomEventType.PointerUp, handlePointerUp)
  target.addEventListener(
    DomEventType.LostPointerCapture,
    handlePointerCaptureLost
  )
  RendererWorker.send(
    'EditorImage.handlePointerDown',
    pointerId,
    clientX,
    clientY
  )
}

/**
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { clientX, clientY, deltaX, deltaY } = event
  RendererWorker.send(
    'EditorImage.handleWheel',
    clientX,
    clientY,
    deltaX,
    deltaY
  )
}

/**
 *
 * @param {MouseEvent} event
 */
export const handleContextMenu = (event) => {
  event.preventDefault()
  const { clientX, clientY } = event
  RendererWorker.send('EditorImage.handleContextMenu', clientX, clientY)
}

export const handleError = (event) => {
  RendererWorker.send('EditorImage.handleImageError')
}
