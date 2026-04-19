import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const getProviderProtocolAndPath = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol !== FileSystemProtocol.ExtensionHost) {
    return {
      protocol,
      path: GetProtocol.getPath(protocol, uri),
    }
  }
  const providerUri = GetProtocol.getPath(protocol, uri)
  const providerProtocol = GetProtocol.getProtocol(providerUri)
  return {
    protocol: providerProtocol,
    path: GetProtocol.getPath(providerProtocol, providerUri),
  }
}

export const readFile = (uri) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
  // TODO there shouldn't be multiple file system providers for the same protocol
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemReadFile,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const remove = (uri) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
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
  const { protocol, path: oldPath } = getProviderProtocolAndPath(oldUri)
  const { protocol: newProtocol, path: newPath } = getProviderProtocolAndPath(newUri)
  Assert.string(newProtocol)
  if (newProtocol !== protocol) {
    throw new Error(`expected both uris to use same file system provider, got ${protocol} and ${newProtocol}`)
  }
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemRename,
    params: [protocol, oldPath, newPath],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const mkdir = (uri) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemMkdir,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const createFile = (uri) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemWriteFile,
    params: [protocol, path, ''],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const createFolder = (uri) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemCreateFolder,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const writeFile = (uri, content) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemWriteFile,
    params: [protocol, path, content],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const readDirWithFileTypes = (uri) => {
  const { protocol, path } = getProviderProtocolAndPath(uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemReadDirWithFileTypes,
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const getPathSeparator = async (uri) => {
  const { protocol } = getProviderProtocolAndPath(uri)
  const pathSeparator = await ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: ExtensionHostCommandType.FileSystemGetPathSeparator,
    params: [protocol],
    noProviderFoundMessage: 'no file system provider found',
  })
  Assert.string(pathSeparator)
  return pathSeparator
}
