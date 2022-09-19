import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'Disk'

export const copy = (source, target) => {
  return SharedProcess.invoke(
    /* FileSystem.copy */ 'FileSystem.copy',
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

export const writeFile = async (path, content, encoding) => {
  await SharedProcess.invoke(
    /* FileSystem.writeFile */ 'FileSystem.writeFile',
    /* path */ path,
    /* content */ content,
    /* encoding */ encoding
  )
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  return SharedProcess.invoke(
    /* FileSystem.readDirWithFileTypes */ 'FileSystem.readDirWithFileTypes',
    /* path */ path
  )
}

export const getBlobUrl = (path) => {
  return `/remote/${path}`
}

export const getPathSeparator = () => {
  if (Platform.platform === PlatformType.Web) {
    return PathSeparatorType.Slash
  }
  return SharedProcess.invoke(
    /* FileSystem.getPathSeparator */ 'FileSystem.getPathSeparator'
  )
}

export const getRealPath = (path) => {
  return SharedProcess.invoke(
    /* FileSystem.getRealPath */ 'FileSystem.getRealPath',
    /* path */ path
  )
}

export const stat = (path) => {
  return SharedProcess.invoke(
    /* FileSystem.stat */ 'FileSystem.stat',
    /* path */ path
  )
}

export const chmod = (path, permissions) => {
  return SharedProcess.invoke(
    /* FileSystem.stat */ 'FileSystem.chmod',
    /* path */ path,
    /* permissions */ permissions
  )
}

export const canBeRestored = true
