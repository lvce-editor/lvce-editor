import * as FileSystemProcess from '../FileSystemProcess/FileSystemProcess.js'
import * as GetRemoteSrc from '../GetRemoteSrc/GetRemoteSrc.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

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
  return FileSystemProcess.invoke('FileSystem.copy', /* source */ source, /* target */ target)
}

export const readFile = (path, encoding) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.readFile', /* path */ path, /* encoding */ encoding)
}

export const readJson = (path) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.readJson', /* path */ path)
}

export const remove = (path) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.remove', /* path */ path)
}

export const rename = (oldUri, newUri) => {
  oldUri = toUri(oldUri)
  newUri = toUri(newUri)
  return FileSystemProcess.invoke('FileSystem.rename', /* oldPath */ oldUri, /* newPath */ newUri)
}

export const mkdir = (path) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.mkdir', /* path */ path)
}

export const writeFile = async (path, content, encoding) => {
  path = toUri(path)
  await FileSystemProcess.invoke(/* FileSystem.writeFile */ 'FileSystem.writeFile', /* path */ path, /* content */ content, /* encoding */ encoding)
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.readDirWithFileTypes', /* path */ path)
}

export const getBlobUrl = (path) => {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return GetRemoteSrc.getRemoteSrc(path)
}

export const getBlob = async (path, type) => {
  const content = await FileSystemProcess.invoke('FileSystem.readFileAsBuffer', path)
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
  return FileSystemProcess.invoke('FileSystem.getPathSeparator')
}

export const getRealPath = (path) => {
  return FileSystemProcess.invoke('FileSystem.getRealPath', /* path */ path)
}

export const stat = (path) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.stat', /* path */ path)
}

export const getFolderSize = (path) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.getFolderSize', /* path */ path)
}

export const chmod = (path, permissions) => {
  path = toUri(path)
  return FileSystemProcess.invoke('FileSystem.chmod', /* path */ path, /* permissions */ permissions)
}

export const canBeRestored = true
