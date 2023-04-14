import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const hidePanel = () => {
  RendererWorker.send('Layout.hidePanel')
}

export const toggleMaximize = () => {
  RendererWorker.send('Layout.maximizePanel')
}
