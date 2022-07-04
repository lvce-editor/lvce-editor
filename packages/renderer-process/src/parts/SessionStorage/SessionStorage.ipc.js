import * as Command from '../Command/Command.js'
import * as SessionStorage from './SessionStorage.js'

export const __initialize__ = () => {
  Command.register('SessionStorage.clear', SessionStorage.clear)
  Command.register('SessionStorage.getItem', SessionStorage.getItem)
  Command.register('SessionStorage.setItem', SessionStorage.setItem)
}
