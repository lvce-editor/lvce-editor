import { VError } from '../VError/VError.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const state = {
  fileSystemProviderMap: Object.create(null),
}

const getFileSystemProvider = (protocol) => {
  const provider = state.fileSystemProviderMap[protocol]
  if (!provider) {
    // @ts-ignore
    throw new VError(`no file system provider for protocol "${protocol}" found`)
  }
  return provider
}

export const registerFileSystemProvider = (fileSystemProvider) => {
  if (!fileSystemProvider.id) {
    throw new Error('Failed to register file system provider: missing id')
  }
  state.fileSystemProviderMap[fileSystemProvider.id] = fileSystemProvider
}

export const readDirWithFileTypes = async (protocol, path) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.readDirWithFileTypes(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const readFile = async (protocol, path) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.readFile(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const readFileExternal = async (path) => {
  // TODO when file is local,
  // don't ask renderer worker
  // instead read file directly from shared process
  // this avoid parsing the potentially large message
  // and improve performance by not blocking the renderer worker
  // when reading / writing large files
  const content = await Rpc.invoke('FileSystem.readFile', path)
  return content
}

export const remove = async (protocol, path) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.remove(path)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const rename = async (protocol, oldUri, newUri) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.rename(oldUri, newUri)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const writeFile = async (protocol, uri, content) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return await provider.writeFile(uri, content)
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}

export const getPathSeparator = (protocol) => {
  try {
    const provider = getFileSystemProvider(protocol)
    return provider.pathSeparator
  } catch (error) {
    throw new VError(error, 'Failed to execute file system provider')
  }
}
