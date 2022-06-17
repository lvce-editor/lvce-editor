import * as Command from '../Command/Command.js'
import * as SessionStorage from './SessionStorage.js'

// TODO only use SessionStorage module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register(6755, SessionStorage.clear)
  Command.register(6756, SessionStorage.getJson)
}
