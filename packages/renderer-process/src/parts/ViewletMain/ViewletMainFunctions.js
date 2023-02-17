import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleDragOver = (x, y) => {
  RendererWorker.send('Main.handleDragOver', x, y)
}

export const handleDropFiles = (x, y, files) => {
  RendererWorker.send('Main.handleDrop', x, y, files)
}

export const handleDropFilePath = (x, y, filePath) => {
  RendererWorker.send('Main.handleDropFilePath', x, y, filePath)
}

export const handleDragLeave = (x, y) => {
  RendererWorker.send('Main.handleDragLeave', x, y)
}
