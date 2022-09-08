import * as LocalStorage from './LocalStorage.js'

// TODO only use LocalStorage module via ipc -> that way is is always lazyloaded

export const Commands = {
  'LocalStorage.clear': LocalStorage.clear,
  'LocalStorage.getJson': LocalStorage.getJson,
  'LocalStorage.getText': LocalStorage.getText,
  'LocalStorage.setJson': LocalStorage.setJson,
  'LocalStorage.setText': LocalStorage.setText,
}
