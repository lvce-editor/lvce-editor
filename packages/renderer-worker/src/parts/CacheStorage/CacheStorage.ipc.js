import * as Command from '../Command/Command.js'
import * as CacheStorage from './CacheStorage.js'

// TODO only use CacheStorage module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register(6800, CacheStorage.clearCache)
  Command.register(6801, CacheStorage.setJson)
  Command.register(6802, CacheStorage.getJson)
}
