import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 * @param {number} x
 * @param {number} y
 */
export const handleSliderPointerMove = (x, y) => {
  RendererWorker.send('ColorPicker.handleSliderPointerMove', x, y)
}

/**
 *
 * @param {number} x
 * @param {number} y
 */
export const handleSliderPointerDown = (x, y) => {
  RendererWorker.send('ColorPicker.handleSliderPointerDown', x, y)
}
