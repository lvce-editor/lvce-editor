import * as WebStorage from '../WebStorage/WebStorage.js'
import * as WebStorageType from '../WebStorageType/WebStorageType.js'

export const create = (id, uri) => {
  return {
    uid: id,
    localStorage: {},
    sessionStorage: {},
  }
}

export const loadContent = async (state) => {
  const localStorage = await WebStorage.getAll(WebStorageType.LocalStorage)
  const sessionStorage = await WebStorage.getAll(WebStorageType.SessionStorage)
  return {
    ...state,
    localStorage,
    sessionStorage,
  }
}
