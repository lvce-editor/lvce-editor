import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const selectIndex = (index) => {
  RendererWorker.send('EditorCompletion.selectIndex', index)
}

export const handleWheel = (deltaY) => {
  RendererWorker.send('EditorCompletion.handleWheel', deltaY)
}
