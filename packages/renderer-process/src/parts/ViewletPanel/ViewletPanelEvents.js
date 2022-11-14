import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleClickClose = (event) => {
  RendererWorker.send('Layout.hidePanel')
}
