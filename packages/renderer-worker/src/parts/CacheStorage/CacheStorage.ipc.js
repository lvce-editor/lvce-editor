import * as CacheStorage from './CacheStorage.js'

// TODO only use CacheStorage module via ipc -> that way is is always lazyloaded

export const name = 'CacheStorage'

export const Commands = {
  clearCache: CacheStorage.clearCache,
  getEditorFileCache: CacheStorage.getEditorFileCache,
  getJson: CacheStorage.getJson,
  removeEditorFileCache: CacheStorage.removeEditorFileCache,
  setEditorFileCache: CacheStorage.setEditorFileCache,
  setJson: CacheStorage.setJson,
}
