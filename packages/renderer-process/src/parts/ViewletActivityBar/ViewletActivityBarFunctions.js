import * as RendererWorker from '../RendererWorker/RendererWorker.js'

/**
 *
 * @param {number} index
 * @param {number} x
 * @param {number} y
 */
export const handleClick = (index, x, y) => {
  RendererWorker.send('ActivityBar.handleClick', index, x, y)
}

export const handleBlur = () => {
  RendererWorker.send('ActivityBar.handleBlur')
}

export const handleFocus = () => {
  RendererWorker.send('ActivityBar.focus')
}
