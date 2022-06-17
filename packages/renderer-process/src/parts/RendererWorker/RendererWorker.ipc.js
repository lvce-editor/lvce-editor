import * as Command from '../Command/Command.js'
import * as RendererWorker from './RendererWorker.js'

export const __initialize__ = () => {
  Command.register(909090, RendererWorker.handleInvoke)
}
