import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

// TODO move all of this to an extension

export const canBeRestored = true

export const name = 'Fetch'

export const state = {
  files: Object.create(null),
}

export const readFile = async (uri) => {
  return FileSearchWorker.invoke('FileSystemFetch.readFile', uri)
}

export const writeFile = (uri, content) => {
  return FileSearchWorker.invoke('FileSystemFetch.writeFile', uri)
}

export const mkdir = (uri) => {
  return FileSearchWorker.invoke('FileSystemFetch.mkdir', uri)
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  return FileSearchWorker.invoke('FileSystemFetch.remove', uri)
}

export const readDirWithFileTypes = async (uri) => {
  return FileSearchWorker.invoke('FileSystemFetch.readDirWithFileTypes', uri)
}

export const chmod = (path, permissions) => {
  return FileSearchWorker.invoke('FileSystemFetch.chmod', path, permissions)
}

export const getBlob = async (uri, type) => {
  return FileSearchWorker.invoke('FileSystemFetch.getBlob', uri, type)
}
