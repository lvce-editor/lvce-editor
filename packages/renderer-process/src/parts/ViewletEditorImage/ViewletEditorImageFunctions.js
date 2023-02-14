import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handlePointerMove = (pointerId, x, y) => {
  RendererWorker.send('EditorImage.handlePointerMove', pointerId, x, y)
}

export const handlePointerUp = (pointerId, x, y) => {
  RendererWorker.send('EditorImage.handlePointerUp', pointerId, x, y)
}

export const handlePointerDown = (pointerId, x, y) => {
  RendererWorker.send('EditorImage.handlePointerDown', pointerId, x, y)
}

export const handleWheel = (clientX, clientY, deltaX, deltaY) => {
  RendererWorker.send('EditorImage.handleWheel', clientX, clientY, deltaX, deltaY)
}

export const handleImageError = () => {
  RendererWorker.send('EditorImage.handleImageError')
}

export const handleContextMenu = (button, x, y) => {
  RendererWorker.send('EditorImage.handleContextMenu', button, x, y)
}
