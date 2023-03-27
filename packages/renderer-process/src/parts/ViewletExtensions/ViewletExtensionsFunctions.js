import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 * @param {number} y
 */
export const handleScrollBarClick = (y) => {
  RendererWorker.send('Extensions.handleScrollBarClick', y)
}

/**
 * @param {number} index
 */
export const handleClick = (index) => {
  RendererWorker.send('Extensions.handleClick', index)
}

/**
 *
 * @param {number} deltaY
 */
export const handleWheel = (deltaMode, deltaY) => {
  RendererWorker.send('Extensions.handleWheel', deltaMode, deltaY)
}

/**
 * @param {string} value
 */
export const handleInput = (value) => {
  RendererWorker.send('Extensions.handleInput', value)
}

/**
 *
 * @param {number} timeStamp
 * @param {*} changedTouchesArray
 */
export const handleTouchMove = (timeStamp, changedTouchesArray) => {
  RendererWorker.send('Extensions.handleTouchMove', timeStamp, changedTouchesArray)
}

/**
 *
 * @param {number} timeStamp
 * @param {*} changedTouchesArray
 */
export const handleTouchStart = (timeStamp, changedTouchesArray) => {
  RendererWorker.send('Extensions.handleTouchStart', timeStamp, changedTouchesArray)
}

/**
 *
 */
export const handleTouchEnd = (changedTouchesArray) => {
  RendererWorker.send('Extensions.handleTouchEnd', changedTouchesArray)
}

/**
 *
 */
export const handleContextMenu = (button, clientX, clientY) => {
  RendererWorker.send('Extensions.handleContextMenu', button, clientX, clientY)
}

export const handleScrollBarThumbPointerMove = (y) => {
  RendererWorker.send(/* Extensions.handleScrollBarMouseMove */ 'Extensions.handleScrollBarMove', /* y */ y)
}
