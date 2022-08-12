import * as WebStorage from '../WebStorage/WebStorage.js'

const storageType = WebStorage.StorageType.SessionStorage

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
  return WebStorage.setText(storageType, key, value)
}

export const setJson = (key, value) => {
  return WebStorage.setJson(storageType, key, value)
}
