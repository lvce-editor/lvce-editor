import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleAudioError = (code, message) => {
  RendererWorker.send('Audio.handleAudioError', code, message)
}
