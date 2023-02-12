import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleReadmeContextMenu = (x, y, props) => {
  RendererWorker.send('ExtensionDetail.handleReadmeContextMenu', x, y, props)
}

export const handleIconError = () => {
  RendererWorker.send('ExtensionDetail.handleIconError')
}
