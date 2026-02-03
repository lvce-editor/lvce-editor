import * as Assert from '../Assert/Assert.ts'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetFileSystem from '../GetFileSystem/GetFileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

export const readFile = async (uri, encoding = EncodingType.Utf8) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'untitled') {
    return ''
  }
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readFile(path, encoding)
}

export const readJson = async (uri, encoding) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readJson(path, encoding)
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

export const writeBlob = async (uri, blob) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.writeBlob(path, blob)
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
  if (fileSystem.getBlobSrc) {
    return fileSystem.getBlobSrc(path)
  }
  if (fileSystem.getBlobUrl) {
    return fileSystem.getBlobUrl(path)
  }
  throw new Error(`Filesystem doesn't support the getBlobUrl function`)
}

export const getBlob = async (uri, type) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getBlob(path, type)
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

export const getFolderSize = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getFolderSize(path)
}

export const chmod = async (uri, permissions) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.chmod(path, permissions)
}

export const exists = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.exists(path)
}

export const canBeRestored = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'storage-overview') {
    return true
  }
  if (protocol === 'extension-detail') {
    return true
  }
  if (protocol === 'screen-cast') {
    return true
  }
  if (protocol === 'diff') {
    return true
  }
  if (protocol === 'inline-diff') {
    return true
  }
  if (protocol === 'simple-browser') {
    return true
  }
  if (protocol === 'iframe-inspector') {
    return true
  }
  if (protocol === 'settings') {
    return true
  }
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.canBeRestored
}
