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

export const handleSashPointerDown = (x, y) => {
  RendererWorker.send('Main.handleSashPointerDown', x, y)
}

export const handleSashPointerMove = (x, y) => {
  RendererWorker.send('Main.handleSashPointerMove', x, y)
}
