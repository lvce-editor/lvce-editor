import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleIconError = (event) => {
  RendererWorker.send('ExtensionDetail.handleIconError')
}
