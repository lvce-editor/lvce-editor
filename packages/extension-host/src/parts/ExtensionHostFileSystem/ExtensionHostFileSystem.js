import VError from 'verror'
import { ExecutionError } from '../Error/Error.js'

// TODO rename this module to `ExtensionHostFileSystem`

export const state = {
  fileSystemProviderMap: Object.create(null),
}

const getFileSystemProvider = (protocol) => {
  const provider = state.fileSystemProviderMap[protocol]
  if (!provider) {
    console.log({ state })
    throw new VError(`no file system provider for protocol "${protocol}" found`)
  }
  return provider
}

export const registerFileSystemProvider = (fileSystemProvider) => {
  state.fileSystemProviderMap[fileSystemProvider.id] = fileSystemProvider
}

export const readDirWithFileTypes = async (protocol, path) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.readDirWithFileTypes(path)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute file system provider',
    })
  }
}

export const readFile = async (protocol, path) => {
  console.log({ protocol, path })
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.readFile(path)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute file system provider',
    })
  }
}

export const remove = async (protocol, path) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.remove(path)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute file system provider',
    })
  }
}

export const rename = async (protocol, oldUri, newUri) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.rename(oldUri, newUri)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute file system provider',
    })
  }
}

export const writeFile = async (protocol, uri, content) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.writeFile(uri, content)
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute file system provider',
    })
  }
}

export const getPathSeparator = (protocol) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return provider.pathSeparator
  } catch (error) {
    throw new ExecutionError({
      cause: error,
      message: 'Failed to execute file system provider',
    })
  }
}
