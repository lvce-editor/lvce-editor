import * as LocalStorage from '../LocalStorage/LocalStorage.js'

export const getJson = (viewletId) => {
  return LocalStorage.getJson(viewletId)
}

export const setJson = (viewletId, value) => {
  return LocalStorage.setJson(viewletId, value)
}

export const setJsonObjects = (value) => {
  return LocalStorage.setJsonObjects(value)
}
