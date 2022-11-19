import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleAudioError = (event) => {
  const { target } = event
  const { error } = target
  const { code, message } = error
  RendererWorker.send('Audio.handleAudioError', code, message)
}
