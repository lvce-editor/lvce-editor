import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const pointerMoveOptions = {
  passive: true,
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerMove = (event) => {
  const { clientX, clientY } = event
  RendererWorker.send('EditorImage.handlePointerMove', clientX, clientY)
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerUp = (event) => {
  // @ts-ignore
  window.removeEventListener(
    'pointermove',
    handlePointerMove,
    pointerMoveOptions
  )
  window.removeEventListener('pointerup', handlePointerUp)
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerDown = (event) => {
  const { clientX, clientY } = event
  window.addEventListener('pointermove', handlePointerMove, pointerMoveOptions)
  window.addEventListener('pointerup', handlePointerUp)
  RendererWorker.send('EditorImage.handlePointerDown', clientX, clientY)
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
