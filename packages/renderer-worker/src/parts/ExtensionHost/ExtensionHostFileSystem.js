import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

export const readFile = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  // TODO there shouldn't be multiple file system providers for the same protocol
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemReadFile,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const remove = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemRemove,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

/**
 *
 * @param {string} oldUri
 * @param {string} newUri
 */
export const rename = (oldUri, newUri) => {
  const protocol = GetProtocol.getProtocol(oldUri)
  const oldPath = GetProtocol.getPath(protocol, oldUri)
  const newPath = GetProtocol.getPath(protocol, newUri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemRename,
    params: [protocol, oldPath, newPath],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const mkdir = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemMkdir,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const createFile = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemWriteFile,
    params: [protocol, path, ''],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const createFolder = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemCreateFolder,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const writeFile = (uri, content) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemWriteFile,
    params: [protocol, path, content],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const readDirWithFileTypes = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemReadDirWithFileTypes,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const getPathSeparator = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const pathSeparator = await ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemGetPathSeparator,
    params: [protocol],
    noProviderFoundMessage: 'no file system provider found',
  })
  Assert.string(pathSeparator)
  return pathSeparator
}
