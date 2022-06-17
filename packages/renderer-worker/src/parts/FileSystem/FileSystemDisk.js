import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const copy = (protocol, source, target) => {
  return SharedProcess.invoke(
    /* FileSystem.copy */ 'Filesystem.copy',
    /* source */ source,
    /* target */ target
  )
}

export const readFile = (protocol, path) => {
  return SharedProcess.invoke(
    /* FileSystem.readFile */ 'FileSystem.readFile',
    /* path */ path
  )
}

export const remove = (protocol, path) => {
  return SharedProcess.invoke(
    /* FileSystem.remove */ 'FileSystem.remove',
    /* path */ path
  )
}

export const rename = (protocol, oldUri, newUri) => {
  return SharedProcess.invoke(
    /* FileSystem.rename */ 'FileSystem.rename',
    /* oldPath */ oldUri,
    /* newPath */ newUri
  )
}

export const mkdir = (protocol, path) => {
  return SharedProcess.invoke(
    /* FileSystem.mkdir */ 'FileSystem.mkdir',
    /* path */ path
  )
}

export const writeFile = async (protocol, path, content) => {
  await SharedProcess.invoke(
    /* FileSystem.writeFile */ 'FileSystem.writeFile',
    /* path */ path,
    /* content */ content
  )
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (protocol, path) => {
  return SharedProcess.invoke(
    /* FileSystem.readDirWithFileTypes */ 'FileSystem.readDirWithFileTypes',
    /* path */ path
  )
}

export const getBlobUrl = (protocol, path) => {
  return `/remote/${path}`
}

export const getPathSeparator = (protocol) => {
  if (Platform.getPlatform() === 'web') {
    return '/'
  }
  return SharedProcess.invoke(
    /* FileSystem.getPathSeparator */ 'FileSystem.getPathSeparator'
  )
}
