import * as LocalStorage from './LocalStorage.js'

// TODO only use LocalStorage module via ipc -> that way is is always lazyloaded

export const Commands = {
  'LocalStorage.clear': LocalStorage.clear,
  'LocalStorage.setJson': LocalStorage.setJson,
  'LocalStorage.getJson': LocalStorage.getJson,
  'LocalStorage.getText': LocalStorage.getText,
  'LocalStorage.setText': LocalStorage.setText,
}
