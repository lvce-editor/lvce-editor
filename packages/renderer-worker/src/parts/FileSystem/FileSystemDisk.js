import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const name = 'Disk'

export const copy = (source, target) => {
  return SharedProcess.invoke(
    /* FileSystem.copy */ 'Filesystem.copy',
    /* source */ source,
    /* target */ target
  )
}

export const readFile = (path) => {
  return SharedProcess.invoke(
    /* FileSystem.readFile */ 'FileSystem.readFile',
    /* path */ path
  )
}

export const remove = (path) => {
  return SharedProcess.invoke(
    /* FileSystem.remove */ 'FileSystem.remove',
    /* path */ path
  )
}

export const rename = (oldUri, newUri) => {
  return SharedProcess.invoke(
    /* FileSystem.rename */ 'FileSystem.rename',
    /* oldPath */ oldUri,
    /* newPath */ newUri
  )
}

export const mkdir = (path) => {
  return SharedProcess.invoke(
    /* FileSystem.mkdir */ 'FileSystem.mkdir',
    /* path */ path
  )
}

export const writeFile = async (path, content) => {
  await SharedProcess.invoke(
    /* FileSystem.writeFile */ 'FileSystem.writeFile',
    /* path */ path,
    /* content */ content
  )
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  console.log('invoke shared process', path)
  return SharedProcess.invoke(
    /* FileSystem.readDirWithFileTypes */ 'FileSystem.readDirWithFileTypes',
    /* path */ path
  )
}

export const getBlobUrl = (path) => {
  return `/remote/${path}`
}

export const getPathSeparator = () => {
  if (Platform.getPlatform() === 'web') {
    return '/'
  }
  return SharedProcess.invoke(
    /* FileSystem.getPathSeparator */ 'FileSystem.getPathSeparator'
  )
}
