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
export const handleWheel = (deltaY) => {
  RendererWorker.send('Extensions.handleWheel', deltaY)
}

/**
 * @param {string} value
 */
export const handleInput = (value) => {
  RendererWorker.send('Extensions.handleInput', value)
}

export const handleTouchMove = (timeStamp, changedTouchesArray) => {
  RendererWorker.send('Extensions.handleTouchMove', timeStamp, changedTouchesArray)
}

export const handleTouchStart = (timeStamp, changedTouchesArray) => {
  RendererWorker.send('Extensions.handleTouchStart', timeStamp, changedTouchesArray)
}

export const handleTouchEnd = (timeStamp, changedTouchesArray) => {
  RendererWorker.send('Extensions.handleTouchEnd', timeStamp, changedTouchesArray)
}
