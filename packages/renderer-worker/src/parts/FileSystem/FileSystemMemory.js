import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'Memory'

const memfsPrefix = 'memfs://'

const getPath = (uri) => {
  if (uri.startsWith(memfsPrefix)) {
    return uri.slice(memfsPrefix.length)
  }
  return uri
}

export const readFile = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.readFile', getPath(uri))
}

export const exists = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.exists', getPath(uri))
}

export const writeFile = (uri, content) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.writeFile', getPath(uri), content)
}

export const mkdir = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.mkdir', getPath(uri))
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.remove', getPath(uri))
}

export const readDirWithFileTypes = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.readDirWithFileTypes', getPath(uri))
}

export const getBlobUrl = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.getBlobUrl', getPath(uri))
}

export const getBlob = async (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.getBlob', getPath(uri))
}

export const chmod = (path, permissions) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.chmod', getPath(path), permissions)
}

export const rename = (oldPath, newPath) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.rename', getPath(oldPath), getPath(newPath))
}

export const copy = (oldPath, newPath) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.copy', getPath(oldPath), getPath(newPath))
}

export const stat = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.stat', getPath(uri))
}

export const getFiles = () => {
  return ExtensionHostWorker.invoke('FileSystemMemory.getFiles')
}
