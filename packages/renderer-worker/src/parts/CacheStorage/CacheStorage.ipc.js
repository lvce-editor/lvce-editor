import * as CacheStorage from './CacheStorage.js'

// TODO only use CacheStorage module via ipc -> that way is is always lazyloaded

export const name = 'CacheStorage'

export const Commands = {
  clearCache: CacheStorage.clearCache,
  getJson: CacheStorage.getJson,
  setJson: CacheStorage.setJson,
}
