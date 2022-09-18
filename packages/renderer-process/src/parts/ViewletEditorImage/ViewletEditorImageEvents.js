import * as RendererWorker from '../RendererWorker/RendererWorker.js'

const pointerMoveOptions = {
  passive: true,
}

// TODO figure out if it is possible to remove state from here
export const state = {
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
  const { pointerId, clientX, clientY, target } = event
  // @ts-ignore
  target.releasePointerCapture(pointerId)
  state.pointerDownCount--
  if (state.pointerDownCount === 0) {
    // @ts-ignore
    target.removeEventListener(
      'pointermove',
      // @ts-ignore
      handlePointerMove,
      pointerMoveOptions
    )
    // f.removeEventListener('pointerup', handlePointerUp)
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
  const { pointerId, clientX, clientY, target } = event
  // @ts-ignore
  target.setPointerCapture(pointerId)
  state.pointerDownCount++
  console.log('downcount', state.pointerDownCount)
  if (state.pointerDownCount === 1) {
    target.addEventListener(
      'pointermove',
      // @ts-ignore
      handlePointerMove,
      pointerMoveOptions
    )
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
  console.log('handle wheel')
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
