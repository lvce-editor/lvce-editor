import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleDragOver = (x, y) => {
  RendererWorker.send('Main.handleDragOver', x, y)
}

export const handleDropFiles = (files) => {
  RendererWorker.send('Main.handleDrop', files)
}

export const handleDropFilePath = (filePath) => {
  RendererWorker.send('Main.handleDropFilePath', filePath)
}

export const handleDragEnd = (x, y) => {
  RendererWorker.send('Main.handleDragEnd', x, y)
}

export const closeEditor = (index) => {
  RendererWorker.send('Main.closeEditor', index)
}

export const handleTabClick = (index) => {
  RendererWorker.send('Main.handleTabClick', index)
}

export const handleTabContextMenu = (index, x, y) => {
  RendererWorker.send('Main.handleTabContextMenu', index, x, y)
}
