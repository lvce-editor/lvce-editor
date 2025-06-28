import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'Memory'

export const readFile = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.readFile', uri)
}

export const writeFile = (uri, content) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.writeFile', uri, content)
}

export const mkdir = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.mkdir', uri)
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.remove', uri)
}

export const readDirWithFileTypes = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.readDirWithFileTypes', uri)
}

export const getBlobUrl = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.getBlobUrl', uri)
}

export const getBlob = async (uri) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.getBlob', uri)
}

export const chmod = (path, permissions) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.chmod', path, permissions)
}

export const rename = (oldPath, newPath) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.rename', oldPath, newPath)
}

export const copy = (oldPath, newPath) => {
  return ExtensionHostWorker.invoke('FileSystemMemory.copy', oldPath, newPath)
}

export const getFiles = () => {
  return ExtensionHostWorker.invoke('FileSystemMemory.getFiles')
}
