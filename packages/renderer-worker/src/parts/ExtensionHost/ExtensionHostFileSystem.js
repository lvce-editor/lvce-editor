import * as ExtensionHostShared from './ExtensionHostShared.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

export const readFile = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  // TODO there shouldn't be multiple file system providers for the same protocol
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.readFile',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const remove = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.remove',
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
    method: 'ExtensionHostFileSystem.rename',
    params: [protocol, oldPath, newPath],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const mkdir = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.mkdir',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const createFile = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.writeFile',
    params: [protocol, path, ''],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const createFolder = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.createFolder',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const writeFile = (uri, content) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.writeFile',
    params: [protocol, path, content],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const readDirWithFileTypes = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const path = GetProtocol.getPath(protocol, uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.readDirWithFileTypes',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
  })
}

export const getPathSeparator = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.getPathSeparator',
    params: [protocol],
    noProviderFoundMessage: 'no file system provider found',
  })
}
