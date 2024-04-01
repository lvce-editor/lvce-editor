import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleInput = (value) => {
  RendererWorker.send('Terminal.write', value)
}
