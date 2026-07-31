import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

// TODO move all of this to an extension

export const canBeRestored = true

export const name = 'Fetch'

export const state = {
  files: Object.create(null),
}

const fetchPrefix = 'fetch://'

const normalizeUri = (uri) => {
  if (uri.startsWith(fetchPrefix)) {
    return uri.slice(fetchPrefix.length)
  }
  return uri
}

export const readFile = async (uri) => {
  uri = normalizeUri(uri)
  if (uri.startsWith('localhost:') || uri.startsWith(location.host)) {
    return FileSystemWorker.invoke('FileSystem.readFile', `${location.protocol}//${uri}`)
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return FileSystemWorker.invoke('FileSystemFetch.readFile', uri)
  }
  return FileSystemWorker.invoke('FileSystem.readFile', uri)
}

export const exists = async (uri) => {
  try {
    await readFile(uri)
    return true
  } catch {
    return false
  }
}

export const readJson = async (uri) => {
  uri = normalizeUri(uri)
  if (uri.startsWith('localhost:') || uri.startsWith(location.host)) {
    return FileSystemWorker.invoke('FileSystem.readJson', `${location.protocol}//${uri}`)
  }
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return FileSystemWorker.invoke('FileSystem.readJson', uri)
  }
  return FileSystemWorker.invoke('FileSystem.readJson', uri)
}

export const writeFile = (uri, content) => {
  uri = normalizeUri(uri)
  throw new Error('Fetch file systems are readonly')
}

export const mkdir = (uri) => {
  uri = normalizeUri(uri)
  throw new Error('Fetch file systems are readonly')
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const isReadonly = () => {
  return true
}

export const remove = (uri) => {
  uri = normalizeUri(uri)
  throw new Error('Fetch file systems are readonly')
}

export const readDirWithFileTypes = async (uri) => {
  uri = normalizeUri(uri)
  return FileSystemWorker.invoke('FileSystem.readDirWithFileTypes', uri)
}

export const chmod = (path, permissions) => {
  path = normalizeUri(path)
  throw new Error('Fetch file systems are readonly')
}

export const getBlob = async (uri, type) => {
  uri = normalizeUri(uri)
  return FileSystemWorker.invoke('FileSystem.readFileAsBlob', uri, type)
}
