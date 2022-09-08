import * as CacheStorage from './CacheStorage.js'

// TODO only use CacheStorage module via ipc -> that way is is always lazyloaded

export const Commands = {
  'CacheStorage.clearCache': CacheStorage.clearCache,
  'CacheStorage.getJson': CacheStorage.getJson,
  'CacheStorage.setJson': CacheStorage.setJson,
}
