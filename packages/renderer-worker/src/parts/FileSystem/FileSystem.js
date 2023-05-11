import * as Assert from '../Assert/Assert.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetFileSystem from '../GetFileSystem/GetFileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

export const readFile = async (uri, encoding = EncodingType.Utf8) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readFile(path, encoding)
}

export const remove = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.remove(path)
}

export const rename = async (oldUri, newUri) => {
  const protocol = GetProtocol.getProtocol(oldUri)
  const oldPath = GetProtocol.getPath(protocol, oldUri)
  const newPath = GetProtocol.getPath(protocol, newUri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.rename(oldPath, newPath)
}

export const mkdir = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.mkdir(path)
}

export const writeFile = async (uri, content, encoding = EncodingType.Utf8) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.writeFile(path, content, encoding)
}

export const createFile = (uri) => {
  return writeFile(uri, '')
}

export const readDirWithFileTypes = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readDirWithFileTypes(path)
}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

export const getBlobUrl = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getBlobUrl(path)
}

export const copy = async (sourceUri, targetUri) => {
  Assert.string(sourceUri)
  Assert.string(targetUri)
  // TODO what if it is not the same file system?
  const protocol = GetProtocol.getProtocol(sourceUri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  const sourcePath = GetProtocol.getPath(protocol, sourceUri)
  const targetPath = GetProtocol.getPath(protocol, targetUri)
  return fileSystem.copy(sourcePath, targetPath)
}

export const getPathSeparator = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getPathSeparator(path)
}

export const getRealPath = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getRealPath(path)
}

export const stat = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.stat(path)
}

export const chmod = async (uri, permissions) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.chmod(path, permissions)
}

export const canBeRestored = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'extension-detail') {
    return true
  }
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.canBeRestored
}
