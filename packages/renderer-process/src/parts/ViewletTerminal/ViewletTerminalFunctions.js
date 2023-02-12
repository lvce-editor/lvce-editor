import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const handleInput = (value) => {
  RendererWorker.send('Terminal', 'write', value)
}
