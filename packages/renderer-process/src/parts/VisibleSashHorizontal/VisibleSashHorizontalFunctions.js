import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleSashPointerDown = (x, y) => {
  RendererWorker.send('Main.handleSashPointerDown', x, y)
}

export const handleSashPointerMove = (x, y) => {
  RendererWorker.send('Main.handleSashPointerMoveHorizontal', x, y)
}
