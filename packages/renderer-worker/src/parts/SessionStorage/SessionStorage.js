import * as WebStorage from '../WebStorage/WebStorage.js'

export const clear = () => {
  return WebStorage.clear(WebStorage.StorageType.SessionStorage)
}

export const getText = (key) => {
  return WebStorage.getText(WebStorage.StorageType.SessionStorage, key)
}

export const getJson = (key) => {
  return WebStorage.getJson(WebStorage.StorageType.SessionStorage, key)
}

export const setText = (key, value) => {
  return WebStorage.setText(WebStorage.StorageType.SessionStorage, key, value)
}

export const setJson = (key, value) => {
  return WebStorage.setJson(WebStorage.StorageType.SessionStorage, key, value)
}
