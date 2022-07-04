import * as Command from '../Command/Command.js'
import * as CacheStorage from './CacheStorage.js'

// TODO only use CacheStorage module via ipc -> that way is is always lazyloaded

export const __initialize__ = () => {
  Command.register('CacheStorage.clearCache', CacheStorage.clearCache)
  Command.register('CacheStorage.setJson', CacheStorage.setJson)
  Command.register('CacheStorage.getJson', CacheStorage.getJson)
}
