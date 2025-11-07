import * as LocalStorage from '../LocalStorage/LocalStorage.js'
import * as OriginPrivateFileSystemStorage from '../OriginPrivateFileSystemStorage/OriginPrivateFileSystemStorage.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const useOriginPrivateFileSystem = false

export const getJson = async (viewletId) => {
  if (useOriginPrivateFileSystem) {
    return OriginPrivateFileSystemStorage.getJson(viewletId)
  }
  return LocalStorage.getJson(viewletId)
}

export const setJson = async (viewletId, value) => {
  console.time('send' + viewletId)
  await SharedProcess.invoke('Workspace.setData', viewletId, value)
  console.timeEnd('send' + viewletId)
  console.log('did send')
  if (useOriginPrivateFileSystem) {
    return OriginPrivateFileSystemStorage.setJson(viewletId, value)
  }
  return LocalStorage.setJson(viewletId, value)
}

export const setJsonObjects = async (value) => {
  await SharedProcess.invoke('Workspace.setData', 'objects', value)

  if (useOriginPrivateFileSystem) {
    return OriginPrivateFileSystemStorage.setJsonObjects(value)
  }
  return LocalStorage.setJsonObjects(value)
}
