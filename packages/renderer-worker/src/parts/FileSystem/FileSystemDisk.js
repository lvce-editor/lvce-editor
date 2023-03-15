import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const name = 'Disk'

export const copy = (source, target) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemCopy, /* source */ source, /* target */ target)
}

export const readFile = (path, encoding) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemReadFile, /* path */ path, /* encoding */ encoding)
}

export const remove = (path) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemRemove, /* path */ path)
}

export const rename = (oldUri, newUri) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemRename, /* oldPath */ oldUri, /* newPath */ newUri)
}

export const mkdir = (path) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemMkdir, /* path */ path)
}

export const writeFile = async (path, content, encoding) => {
  await SharedProcess.invoke(
    /* FileSystem.writeFile */ SharedProcessCommandType.FileSystemWriteFile,
    /* path */ path,
    /* content */ content,
    /* encoding */ encoding
  )
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemReadDirWithFileTypes, /* path */ path)
}

export const getBlobUrl = (path) => {
  return `/remote/${path}`
}

export const getPathSeparator = () => {
  if (Platform.platform === PlatformType.Web) {
    return PathSeparatorType.Slash
  }
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemGetPathSeparator)
}

export const getRealPath = (path) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemGetRealPath, /* path */ path)
}

export const stat = (path) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemStat, /* path */ path)
}

export const chmod = (path, permissions) => {
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemChmod, /* path */ path, /* permissions */ permissions)
}

export const canBeRestored = true
