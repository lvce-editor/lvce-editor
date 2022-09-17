import * as RendererWorker from '../RendererWorker/RendererWorker.js'

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
  window.removeEventListener('pointermove', handlePointerMove, {
    passive: true,
  })
  window.removeEventListener('pointerup', handlePointerUp)
}

/**
 * @param {PointerEvent} event
 */
export const handlePointerDown = (event) => {
  const { clientX, clientY } = event
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
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
