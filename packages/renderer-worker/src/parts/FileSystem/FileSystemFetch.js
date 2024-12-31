import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

// TODO move all of this to an extension

export const canBeRestored = true

export const name = 'Fetch'

export const state = {
  files: Object.create(null),
}

export const readFile = async (uri) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.readFile', uri)
}

export const writeFile = (uri, content) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.writeFile', uri)
}

export const mkdir = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.mkdir', uri)
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.remove', uri)
}

export const readDirWithFileTypes = async (uri) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.readDirWithFileTypes', uri)
}

export const chmod = (path, permissions) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.chmod', path, permissions)
}

export const getBlob = async (uri, type) => {
  return ExtensionHostWorker.invoke('FileSystemFetch.getBlob', uri, type)
}
