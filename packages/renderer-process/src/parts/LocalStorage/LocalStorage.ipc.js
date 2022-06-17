import * as Command from '../Command/Command.js'
import * as LocalStorage from './LocalStorage.js'

export const __initialize__ = () => {
  Command.register(8986, LocalStorage.clear)
  Command.register(8987, LocalStorage.getItem)
  Command.register(8988, LocalStorage.setItem)
}
