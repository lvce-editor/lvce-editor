import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleIconError = (event) => {
  RendererWorker.send('ExtensionDetail.handleIconError')
}

export const handleReadmeContextMenu = (event) => {
  event.preventDefault()
  const { clientX, clientY } = event
  RendererWorker.send(
    'ExtensionDetail.handleReadmeContextMenu',
    clientX,
    clientY
  )
}
