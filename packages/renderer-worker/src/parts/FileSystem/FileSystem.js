import * as Assert from '../Assert/Assert.ts'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetFileSystem from '../GetFileSystem/GetFileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

export const readFile = async (uri, encoding = EncodingType.Utf8) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'untitled') {
    return ''
  }
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readFile(uri, encoding)
}

export const readJson = async (uri, encoding) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readJson(uri, encoding)
}

export const remove = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.remove(uri)
}

export const rename = async (oldUri, newUri) => {
  const protocol = GetProtocol.getProtocol(oldUri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.rename(oldUri, newUri)
}

export const mkdir = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.mkdir(uri)
}

export const writeFile = async (uri, content, encoding = EncodingType.Utf8) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.writeFile(uri, content, encoding)
}

export const writeBlob = async (uri, blob) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.writeBlob(uri, blob)
}

export const createFile = (uri) => {
  return writeFile(uri, '')
}

export const readDirWithFileTypes = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readDirWithFileTypes(uri)
}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

export const getBlobUrl = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  if (fileSystem.getBlobSrc) {
    return fileSystem.getBlobSrc(uri)
  }
  if (fileSystem.getBlobUrl) {
    return fileSystem.getBlobUrl(uri)
  }
  throw new Error(`Filesystem doesn't support the getBlobUrl function`)
}

export const getBlob = async (uri, type) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getBlob(uri, type)
}

export const copy = async (sourceUri, targetUri) => {
  Assert.string(sourceUri)
  Assert.string(targetUri)
  // TODO what if it is not the same file system?
  const protocol = GetProtocol.getProtocol(sourceUri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.copy(sourceUri, targetUri)
}

export const getPathSeparator = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getPathSeparator(uri)
}

export const getRealPath = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getRealPath(uri)
}

export const stat = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.stat(uri)
}

export const getFolderSize = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getFolderSize(uri)
}

export const chmod = async (uri, permissions) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.chmod(uri, permissions)
}

export const exists = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.exists(uri)
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
