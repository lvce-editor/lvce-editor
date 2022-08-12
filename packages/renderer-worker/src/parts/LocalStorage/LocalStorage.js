import * as WebStorage from '../WebStorage/WebStorage.js'

const storageType = WebStorage.StorageType.LocalStorage

export const clear = () => {
  return WebStorage.clear(storageType)
}

export const getText = (key) => {
  return WebStorage.getText(storageType, key)
}

export const getJson = (key) => {
  return WebStorage.getJson(storageType, key)
}

export const setText = (key, value) => {
  return WebStorage.setText(WebStorage.StorageType.LocalStorage, key, value)
}

export const setJson = (key, value) => {
  return WebStorage.setJson(WebStorage.StorageType.LocalStorage, key, value)
}
