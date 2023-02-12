import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleVideoError = (code, message) => {
  RendererWorker.send('Video.handleVideoError', code, message)
}
