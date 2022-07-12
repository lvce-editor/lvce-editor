import * as ExtensionHostShared from './ExtensionHostShared.js'

export const readFile = async (protocol, path) => {
  // TODO there shouldn't be multiple file system providers for the same protocol
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.readFile',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const remove = async (protocol, path) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.remove',
    params: [protocol, path],
    noProviderFoundMessage: `no file system provider found`,
    combineResults(results) {
      return results[0]
    },
  })
}

/**
 *
 * @param {string} protocol
 * @param {string} oldPath
 * @param {string} newPath
 */
export const rename = async (protocol, oldPath, newPath) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.rename',
    params: [protocol, oldPath, newPath],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const mkdir = async (protocol, path) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.mkdir',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const createFile = async (protocol, path) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.writeFile',
    params: [protocol, path, ''],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const createFolder = async (protocol, path) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.createFolder',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const writeFile = async (protocol, path, content) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.writeFile',
    params: [protocol, path, content],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const readDirWithFileTypes = async (protocol, path) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.readDirWithFileTypes',
    params: [protocol, path],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}

export const getPathSeparator = async (protocol) => {
  return ExtensionHostShared.executeProviders({
    event: `onFileSystem:${protocol}`,
    method: 'ExtensionHostFileSystem.getPathSeparator',
    params: [protocol],
    noProviderFoundMessage: 'no file system provider found',
    combineResults(results) {
      return results[0]
    },
  })
}
