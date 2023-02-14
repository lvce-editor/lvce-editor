import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 *
 * @param {string} value
 */
export const handleInput = (value) => {
  RendererWorker.send('Search.handleInput', value)
}

/**
 *
 * @param {number} index
 */
export const handleClick = (index) => {
  RendererWorker.send('Search.handleClick', index)
}

export const handleContextMenu = (button, x, y) => {
  RendererWorker.send('Search.handleContextMenu', button, x, y)
}

export const handleScrollBarMove = (y) => {
  RendererWorker.send('Search.handleScrollBarMove', y)
}

export const handleScrollBarClick = (y) => {
  RendererWorker.send('Search.handleScrollBarClick', y)
}

export const handleWheel = (deltaY) => {
  RendererWorker.send('Search.handleWheel', deltaY)
}
