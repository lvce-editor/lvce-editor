import * as SessionStorage from './SessionStorage.js'

// TODO only use SessionStorage module via ipc -> that way is is always lazyloaded

export const Commands = {
  'SessionStorage.clear': SessionStorage.clear,
  'SessionStorage.getJson': SessionStorage.getJson,
}
