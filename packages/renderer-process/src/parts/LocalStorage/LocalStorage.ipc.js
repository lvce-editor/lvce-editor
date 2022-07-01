import * as Command from '../Command/Command.js'
import * as LocalStorage from './LocalStorage.js'

export const __initialize__ = () => {
  Command.register('LocalStorage.clear', LocalStorage.clear)
  Command.register('LocalStorage.getItem', LocalStorage.getItem)
  Command.register('LocalStorage.setItem', LocalStorage.setItem)
}
