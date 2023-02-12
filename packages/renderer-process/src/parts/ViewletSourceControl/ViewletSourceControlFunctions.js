import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 * @param {string} value
 */
export const handleInput = (value) => {
  RendererWorker.send('Source Control.handleInput', value)
}

/**
 * @param {number} index
 */
export const handleMouseOver = (index) => {
  RendererWorker.send('Source Control.handleMouseOver', index)
}

/**
 * @param {number} index
 */
export const handleClick = (index) => {
  RendererWorker.send('Source Control.handleClick', index)
}

/**
 * @param {number} index
 */
export const handleClickAdd = (index) => {
  RendererWorker.send('Source Control.handleClickAdd', index)
}

/**
 * @param {number} index
 */
export const handleClickRestore = (index) => {
  RendererWorker.send('Source Control.handleClickRestore', index)
}

/**
 * @param {number} index
 */
export const handleClickOpenFile = (index) => {
  RendererWorker.send('Source Control.handleClickOpenFile', index)
}
