import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const hidePanel = () => {
  RendererWorker.send('Layout.hidePanel')
}
