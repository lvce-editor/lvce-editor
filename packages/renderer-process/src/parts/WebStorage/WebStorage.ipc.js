import * as Command from '../Command/Command.js'
import * as WebStorage from './WebStorage.js'

export const __initialize__ = () => {
  Command.register('WebStorage.clear', WebStorage.clear)
  Command.register('WebStorage.getItem', WebStorage.getItem)
  Command.register('WebStorage.setItem', WebStorage.setItem)
}
