import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleVideoError = (code, message) => {
  RendererWorker.send('Video.handleVideoError', code, message)
}
