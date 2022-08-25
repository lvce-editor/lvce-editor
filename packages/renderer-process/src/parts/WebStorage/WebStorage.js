import * as WebStorageType from '../WebStorageType/WebStorageType.js'

const getStorage = (storageType) => {
  switch (storageType) {
    case WebStorageType.LocalStorage:
      return localStorage
    case WebStorageType.SessionStorage:
      return sessionStorage
    default:
      throw new Error(`unsupported storage type ${storageType}`)
  }
}

export const getItem = (storageType, key) => {
  const storage = getStorage(storageType)
  return storage.getItem(key) || undefined
}

export const setItem = (storageType, key, value) => {
  const storage = getStorage(storageType)
  storage.setItem(key, value)
}

export const clear = (storageType) => {
  const storage = getStorage(storageType)
  storage.clear()
}
