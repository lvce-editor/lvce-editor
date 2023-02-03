import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleVideoError = (event) => {
  const { target } = event
  const { error } = target
  const { code, message } = error
  RendererWorker.send('Video.handleVideoError', code, message)
}
