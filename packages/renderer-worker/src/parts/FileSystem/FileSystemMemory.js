import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'Memory'

export const readFile = (uri) => {
  return FileSearchWorker.invoke('FileSystemMemory.readFile', uri)
}

export const writeFile = (uri, content) => {
  return FileSearchWorker.invoke('FileSystemMemory.writeFile', uri, content)
}

export const mkdir = (uri) => {
  return FileSearchWorker.invoke('FileSystemMemory.mkdir', uri)
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  return FileSearchWorker.invoke('FileSystemMemory.remove', uri)
}

export const readDirWithFileTypes = (uri) => {
  return FileSearchWorker.invoke('FileSystemMemory.readDirWithFileTypes', uri)
}

export const getBlobUrl = (uri) => {
  return FileSearchWorker.invoke('FileSystemMemory.getBlobUrl', uri)
}

export const getBlob = async (uri) => {
  const content = await readFile(uri)
  const blob = new Blob([content])
  return blob
}

export const chmod = (path, permissions) => {
  return FileSearchWorker.invoke('FileSystemMemory.chmod', path, permissions)
}

export const getFiles = () => {
  return FileSearchWorker.invoke('FileSystemMemory.getFiles')
}
