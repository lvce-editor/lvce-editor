import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const focus = () => {
  RendererWorker.send('Explorer.focus')
}

export const handleBlur = () => {
  RendererWorker.send('Explorer.handleBlur')
}

export const handleDragOver = (x, y) => {
  RendererWorker.send('Explorer.handleDragOver', x, y)
}

export const handleDrop = (x, y, files) => {
  RendererWorker.send('Explorer.handleDrop', x, y, files)
}

export const handleContextMenuMouseAt = (x, y) => {
  RendererWorker.send('Explorer.handleContextMenuMouseAt', x, y)
}

export const handleContextMenuKeyBoard = () => {
  RendererWorker.send('Explorer.handleContextMenuKeyboard')
}

export const handleClickAt = (x, y) => {
  RendererWorker.send('Explorer.handleClickAt', x, y)
}

export const handleWheel = (deltaY) => {
  RendererWorker.send('Explorer.handleWheel', deltaY)
}

export const updateEditingValue = (value) => {
  RendererWorker.send('Explorer.updateEditingValue', value)
}
