import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleSashPointerMove = (x, y) => {
  RendererWorker.send('Layout.handleSashPointerMove', x, y)
}

export const handleSashPointerDown = (id) => {
  RendererWorker.send('Layout.handleSashPointerDown', id)
}

// TODO send component uid
export const handleSashPointerUp = (id) => {
  RendererWorker.send('Layout.handleSashPointerUp', id)
}

export const handleSashDoubleClick = (id) => {
  RendererWorker.send('Layout.handleSashDoubleClick', id)
}

export const handleResize = (width, height) => {
  RendererWorker.send('Layout.handleResize', width, height)
}

export const handleFocus = () => {
  RendererWorker.send('Layout.handleFocus')
}

export const handleBlur = () => {
  RendererWorker.send('Layout.handleBlur')
}
