import * as WebStorageType from '../WebStorageType/WebStorageType.js'

export const getStorage = (storageType) => {
  switch (storageType) {
    case WebStorageType.LocalStorage:
      return localStorage
    case WebStorageType.SessionStorage:
      return sessionStorage
    default:
      throw new Error(`unsupported storage type ${storageType}`)
  }
}
