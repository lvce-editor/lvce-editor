import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleSashPointerMove = (x, y) => {
  RendererWorker.send('Layout.handleSashPointerMove', x, y)
}

export const handleSashPointerDown = (id) => {
  RendererWorker.send('Layout.handleSashPointerDown', id)
}
