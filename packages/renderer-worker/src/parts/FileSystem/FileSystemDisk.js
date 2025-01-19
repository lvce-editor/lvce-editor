import * as GetRemoteSrc from '../GetRemoteSrc/GetRemoteSrc.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const name = 'Disk'

const toUri = (item) => {
  if (item.startsWith('file://')) {
    return item
  }
  return `file://${item}`
}

export const copy = (source, target) => {
  source = toUri(source)
  target = toUri(target)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemCopy, /* source */ source, /* target */ target)
}

export const readFile = (path, encoding) => {
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemReadFile, /* path */ path, /* encoding */ encoding)
}

export const readJson = (path) => {
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemReadJson, /* path */ path)
}

export const remove = (path) => {
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemRemove, /* path */ path)
}

export const rename = (oldUri, newUri) => {
  oldUri = toUri(oldUri)
  newUri = toUri(newUri)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemRename, /* oldPath */ oldUri, /* newPath */ newUri)
}

export const mkdir = (path) => {
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemMkdir, /* path */ path)
}

export const writeFile = async (path, content, encoding) => {
  path = toUri(path)
  await SharedProcess.invoke(
    /* FileSystem.writeFile */ SharedProcessCommandType.FileSystemWriteFile,
    /* path */ path,
    /* content */ content,
    /* encoding */ encoding,
  )
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemReadDirWithFileTypes, /* path */ path)
}

export const getBlobUrl = (path) => {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return GetRemoteSrc.getRemoteSrc(path)
}

export const getBlob = async (path, type) => {
  const content = await SharedProcess.invoke('FileSystem.readFileAsBuffer', path)
  const array = new Uint8Array(content.data)
  const blob = new Blob([array], {
    type,
  })
  return blob
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
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemStat, /* path */ path)
}

export const getFolderSize = (path) => {
  path = toUri(path)
  return SharedProcess.invoke('FileSystemDisk.getFolderSize', /* path */ path)
}

export const chmod = (path, permissions) => {
  path = toUri(path)
  return SharedProcess.invoke(SharedProcessCommandType.FileSystemChmod, /* path */ path, /* permissions */ permissions)
}

export const canBeRestored = true
