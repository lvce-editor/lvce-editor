import * as StorageBrowser from '../WebStorage/WebStorage.js'

export const clear = () => {
  return StorageBrowser.clear(StorageBrowser.StorageType.LocalStorage)
}

export const getText = (key) => {
  return StorageBrowser.getText(StorageBrowser.StorageType.LocalStorage, key)
}

export const getJson = (key) => {
  return StorageBrowser.getJson(StorageBrowser.StorageType.LocalStorage, key)
}

export const setText = (key, value) => {
  return StorageBrowser.setText(
    StorageBrowser.StorageType.LocalStorage,
    key,
    value
  )
}

export const setJson = (key, value) => {
  return StorageBrowser.setJson(
    StorageBrowser.StorageType.LocalStorage,
    key,
    value
  )
}
