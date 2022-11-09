import * as SessionStorage from './SessionStorage.js'

// TODO only use SessionStorage module via ipc -> that way is is always lazyloaded

export const name = 'SessionStorage'

export const Commands = {
  clear: SessionStorage.clear,
  getJson: SessionStorage.getJson,
}
