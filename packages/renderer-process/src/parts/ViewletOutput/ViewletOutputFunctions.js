import * as RendererWorker from '../RendererWorker/RendererWorker.js'

export const setOutputChannel = (value) => {
  RendererWorker.send('Output', 'setOutputChannel', value)
}
