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

export const handleWheel = (deltaMode, deltaY) => {
  RendererWorker.send('Search.handleWheel', deltaMode, deltaY)
}

export const toggleReplace = () => {
  RendererWorker.send('Search.handleToggleButtonClick')
}

export const toggleMatchCase = () => {
  RendererWorker.send('Search.toggleMatchCase')
}

export const toggleMatchWholeWord = () => {
  RendererWorker.send('Search.toggleMatchWholeWord')
}

export const replaceAll = () => {
  RendererWorker.send('Search.replaceAll')
}

export const toggleUseRegularExpression = () => {
  RendererWorker.send('Search.toggleUseRegularExpression')
}

export const handleReplaceInput = (value) => {
  RendererWorker.send('Search.handleReplaceInput', value)
}

export const handleListFocus = () => {
  RendererWorker.send('Search.handleListFocus')
}

export const handleListBlur = () => {
  RendererWorker.send('Search.handleListBlur')
}
