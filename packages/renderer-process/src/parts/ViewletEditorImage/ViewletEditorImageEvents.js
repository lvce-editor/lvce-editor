import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const pointerMoveOptions = {
  passive: true,
}

const state = {
  pointerDownCount: 0,
}

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
  const { pointerId, clientX, clientY } = event
  state.pointerDownCount--
  console.log('down', state.pointerDownCount)
  if (state.pointerDownCount === 0) {
    // @ts-ignore
    window.removeEventListener(
      'pointermove',
      handlePointerMove,
      pointerMoveOptions
    )
    window.removeEventListener('pointerup', handlePointerUp)
  }
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
  const { pointerId, clientX, clientY } = event
  state.pointerDownCount++
  console.log('down', state.pointerDownCount)
  if (state.pointerDownCount === 1) {
    window.addEventListener(
      'pointermove',
      handlePointerMove,
      pointerMoveOptions
    )
    window.addEventListener('pointerup', handlePointerUp)
  }
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
