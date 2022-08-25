import * as WebStorage from '../WebStorage/WebStorage.js'
import * as WebStorageType from '../WebStorageType/WebStorageType.js'

export const clear = () => {
  return WebStorage.clear(WebStorageType.SessionStorage)
}

export const getText = (key) => {
  return WebStorage.getText(WebStorageType.SessionStorage, key)
}

export const getJson = (key) => {
  return WebStorage.getJson(WebStorageType.SessionStorage, key)
}

export const setText = (key, value) => {
  return WebStorage.setText(WebStorageType.SessionStorage, key, value)
}

export const setJson = (key, value) => {
  return WebStorage.setJson(WebStorageType.SessionStorage, key, value)
}
