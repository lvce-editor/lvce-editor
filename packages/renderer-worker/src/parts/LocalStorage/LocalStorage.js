import * as WebStorage from '../WebStorage/WebStorage.js'
import * as WebStorageType from '../WebStorageType/WebStorageType.js'

export const clear = () => {
  return WebStorage.clear(WebStorageType.LocalStorage)
}

export const getText = (key) => {
  return WebStorage.getText(WebStorageType.LocalStorage, key)
}

export const getJson = (key) => {
  return WebStorage.getJson(WebStorageType.LocalStorage, key)
}

export const setText = (key, value) => {
  return WebStorage.setText(WebStorageType.LocalStorage, key, value)
}

export const setJson = (key, value) => {
  return WebStorage.setJson(WebStorageType.LocalStorage, key, value)
}
