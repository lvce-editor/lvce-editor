import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.js'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.js'
import * as FileSystemProtocol from '../FileSystemProtocol/FileSystemProtocol.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'
import * as ExtensionHostShared from './ExtensionHostShared.js'

const notifyWorkspaceChanged = async (changes) => {
  await Promise.allSettled([Command.execute('Layout.handleWorkspaceRefresh', changes), Command.execute('Layout.refreshSourceControlBadgeCount')])
}

const getProviderProtocolPathAndUri = (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol !== FileSystemProtocol.ExtensionHost) {
    return {
      path: GetProtocol.getPath(protocol, uri),
      protocol,
      uri,
    }
  }
  const providerUri = GetProtocol.getPath(protocol, uri)
  const providerProtocol = GetProtocol.getProtocol(providerUri)
  return {
    path: GetProtocol.getPath(providerProtocol, providerUri),
    protocol: providerProtocol,
    uri: providerUri,
  }
}

const executeProvider = async ({ isolatedMethod, isolatedParams, legacyMethod, legacyParams, protocol }) => {
  const { found, result } = await ExtensionManagementWorker.invoke(isolatedMethod, protocol, ...isolatedParams)
  if (found) {
    return result
  }
  return ExtensionHostShared.executeProvider({
    event: `onFileSystem:${protocol}`,
    method: legacyMethod,
    noProviderFoundMessage: 'no file system provider found',
    params: [protocol, ...legacyParams],
  })
}

export const readFile = (uri) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  return executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderReadFile',
    isolatedParams: [providerUri],
    legacyMethod: ExtensionHostCommandType.FileSystemReadFile,
    legacyParams: [path],
    protocol,
  })
}

export const remove = async (uri) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  const result = await executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderRemove',
    isolatedParams: [providerUri],
    legacyMethod: ExtensionHostCommandType.FileSystemRemove,
    legacyParams: [path],
    protocol,
  })
  await notifyWorkspaceChanged({
    deleted: [uri],
  })
  return result
}

/**
 *
 * @param {string} oldUri
 * @param {string} newUri
 */
export const rename = async (oldUri, newUri) => {
  const { protocol, path: oldPath, uri: providerOldUri } = getProviderProtocolPathAndUri(oldUri)
  const { path: newPath, uri: providerNewUri } = getProviderProtocolPathAndUri(newUri)
  const result = await executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderRename',
    isolatedParams: [providerOldUri, providerNewUri],
    legacyMethod: ExtensionHostCommandType.FileSystemRename,
    legacyParams: [oldPath, newPath],
    protocol,
  })
  await notifyWorkspaceChanged({
    renamed: [[oldUri, newUri]],
  })
  return result
}

export const mkdir = (uri) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  return executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderMkdir',
    isolatedParams: [providerUri],
    legacyMethod: ExtensionHostCommandType.FileSystemMkdir,
    legacyParams: [path],
    protocol,
  })
}

export const createFile = async (uri) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  const result = await executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderWriteFile',
    isolatedParams: [providerUri, ''],
    legacyMethod: ExtensionHostCommandType.FileSystemWriteFile,
    legacyParams: [path, ''],
    protocol,
  })
  await notifyWorkspaceChanged({
    changed: [uri],
  })
  return result
}

export const createFolder = (uri) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  return executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderMkdir',
    isolatedParams: [providerUri],
    legacyMethod: ExtensionHostCommandType.FileSystemCreateFolder,
    legacyParams: [path],
    protocol,
  })
}

export const writeFile = async (uri, content) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  const result = await executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderWriteFile',
    isolatedParams: [providerUri, content],
    legacyMethod: ExtensionHostCommandType.FileSystemWriteFile,
    legacyParams: [path, content],
    protocol,
  })
  await notifyWorkspaceChanged({
    changed: [uri],
  })
  return result
}

export const readDirWithFileTypes = (uri) => {
  const { protocol, path, uri: providerUri } = getProviderProtocolPathAndUri(uri)
  return executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderReadDirWithFileTypes',
    isolatedParams: [providerUri],
    legacyMethod: ExtensionHostCommandType.FileSystemReadDirWithFileTypes,
    legacyParams: [path],
    protocol,
  })
}

export const getPathSeparator = async (uri) => {
  const { protocol } = getProviderProtocolPathAndUri(uri)
  const pathSeparator = await executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderGetPathSeparator',
    isolatedParams: [],
    legacyMethod: ExtensionHostCommandType.FileSystemGetPathSeparator,
    legacyParams: [],
    protocol,
  })
  Assert.string(pathSeparator)
  return pathSeparator
}

export const isReadonly = async (uri) => {
  const { protocol } = getProviderProtocolPathAndUri(uri)
  return executeProvider({
    isolatedMethod: 'Extensions.executeFileSystemProviderIsReadonly',
    isolatedParams: [],
    legacyMethod: ExtensionHostCommandType.FileSystemIsReadonly,
    legacyParams: [],
    protocol,
  })
}
