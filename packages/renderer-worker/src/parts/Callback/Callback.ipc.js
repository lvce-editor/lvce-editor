import * as Command from '../Command/Command.js'
import * as Callback from './Callback.js'

export const __initialize__ = () => {
  Command.register(67330, Callback.resolve)
  Command.register(67331, Callback.reject)
}
