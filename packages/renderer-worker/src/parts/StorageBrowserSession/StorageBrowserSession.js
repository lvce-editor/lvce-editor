import * as StorageBrowser from '../StorageBrowser/StorageBrowser.js'

export const clear = () => {
  return StorageBrowser.clear(StorageBrowser.StorageType.SessionStorage)
}

export const getText = (key) => {
  return StorageBrowser.getText(StorageBrowser.StorageType.SessionStorage, key)
}

export const getJson = (key) => {
  return StorageBrowser.getJson(StorageBrowser.StorageType.SessionStorage, key)
}

export const setText = (key, value) => {
  return StorageBrowser.setText(
    StorageBrowser.StorageType.SessionStorage,
    key,
    value
  )
}

export const setJson = (key, value) => {
  return StorageBrowser.setJson(
    StorageBrowser.StorageType.SessionStorage,
    key,
    value
  )
}
