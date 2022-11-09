import * as LocalStorage from './LocalStorage.js'

// TODO only use LocalStorage module via ipc -> that way is is always lazyloaded

export const name = 'LocalStorage'

export const Commands = {
  clear: LocalStorage.clear,
  getJson: LocalStorage.getJson,
  getText: LocalStorage.getText,
  setJson: LocalStorage.setJson,
  setText: LocalStorage.setText,
}
