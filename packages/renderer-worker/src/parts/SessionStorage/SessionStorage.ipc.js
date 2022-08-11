import * as Command from '../Command/Command.js'
import * as SessionStorage from './SessionStorage.js/index.js'

// TODO only use SessionStorage module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register('SessionStorage.clear', SessionStorage.clear)
  Command.register('SessionStorage.getJson', SessionStorage.getJson)
}
