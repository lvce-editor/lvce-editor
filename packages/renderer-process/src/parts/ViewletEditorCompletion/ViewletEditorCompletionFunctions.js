import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const selectIndex = (index) => {
  RendererWorker.send('EditorCompletion.selectIndex', index)
}

export const handleClickAt = (x, y) => {
  RendererWorker.send('EditorCompletion.handleClickAt', x, y)
}

export const handleWheel = (deltaY, deltaMode) => {
  RendererWorker.send('EditorCompletion.handleWheel', deltaY, deltaMode)
}
