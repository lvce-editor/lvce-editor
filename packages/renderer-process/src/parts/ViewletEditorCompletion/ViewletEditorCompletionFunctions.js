import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const selectIndex = (index) => {
  RendererWorker.send('EditorCompletion.selectIndex', index)
}

export const handleClickAt = (x, y) => {
  RendererWorker.send('EditorCompletion.handleClickAt', x, y)
}

export const handleWheel = (deltaMode, deltaY) => {
  RendererWorker.send('EditorCompletion.handleWheel', deltaMode, deltaY)
}

/**
 * @param {number} y
 */
export const handleScrollBarClick = (y) => {
  RendererWorker.send('EditorCompletion.handleScrollBarClick', y)
}

export const handleScrollBarThumbPointerMove = (y) => {
  RendererWorker.send('EditorCompletion.handleScrollBarMove', y)
}
