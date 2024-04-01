import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const setOutputChannel = (value) => {
  RendererWorker.send('Output', 'setOutputChannel', value)
}
