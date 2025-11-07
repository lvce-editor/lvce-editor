import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as OriginPrivateFileSystemStorage from '../OriginPrivateFileSystemStorage/OriginPrivateFileSystemStorage.js'

const useOriginPrivateFileSystem = true

export const getJson = async (viewletId) => {
  if (useOriginPrivateFileSystem) {
    return OriginPrivateFileSystemStorage.getJson(viewletId)
  }
  return LocalStorage.getJson(viewletId)
}

export const setJson = async (viewletId, value) => {
  if (useOriginPrivateFileSystem) {
    return OriginPrivateFileSystemStorage.setJson(viewletId, value)
  }
  return LocalStorage.setJson(viewletId, value)
}

export const setJsonObjects = async (value) => {
  if (useOriginPrivateFileSystem) {
    console.log(value)
    return
  }
  return LocalStorage.setJsonObjects(value)
}
