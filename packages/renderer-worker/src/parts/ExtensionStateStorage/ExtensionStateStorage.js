import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as StorageKey from '../StorageKey/StorageKey.ts'

export const getJson = () => {
  return LocalStorage.getJson(StorageKey.ExtensionStateStorage)
}

export const setJson = (value) => {
  return LocalStorage.setJson(StorageKey.ExtensionStateStorage, value)
}
