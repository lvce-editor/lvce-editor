import * as Command from '../Command/Command.js'
import * as SessionStorage from './SessionStorage.js'

export const __initialize__ = () => {
  Command.register(8976, SessionStorage.clear)
  Command.register(8977, SessionStorage.getItem)
  Command.register(8978, SessionStorage.setItem)
}
