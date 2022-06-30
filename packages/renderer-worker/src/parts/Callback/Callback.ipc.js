import * as Command from '../Command/Command.js'
import * as Callback from './Callback.js'

export const __initialize__ = () => {
  Command.register('Callback.resolve', Callback.resolve)
  Command.register('Callback.reject', Callback.reject)
}
