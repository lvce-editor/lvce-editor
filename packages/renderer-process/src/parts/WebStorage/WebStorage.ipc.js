import * as WebStorage from './WebStorage.js'

export const name = 'WebStorage'

export const Commands = {
  clear: WebStorage.clear,
  getItem: WebStorage.getItem,
  setItem: WebStorage.setItem,
}
