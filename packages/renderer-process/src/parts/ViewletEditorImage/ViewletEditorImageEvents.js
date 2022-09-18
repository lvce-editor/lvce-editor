import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 * @param {PointerEvent} event
 */
export const handlePointerMove = (event) => {
  const { pointerId, clientX, clientY } = event
  console.log('pointer move', { pointerId, clientX, clientY })
  const coalescedEvents = event.getCoalescedEvents()
  console.log({ coalescedEvents })
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
  const { pointerId, clientX, clientY, target } = event
  // @ts-ignore
  target.releasePointerCapture(pointerId)
  RendererWorker.send(
    'EditorImage.handlePointerUp',
    pointerId,
    clientX,
    clientY
  )
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerDown = (event) => {
  const { pointerId, clientX, clientY, target, button } = event
  // @ts-ignore
  target.setPointerCapture(pointerId)
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
}
