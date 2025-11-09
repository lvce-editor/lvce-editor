import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.js'
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
  return FileSystemWorker.invoke('FileSystem.copy', /* source */ source, /* target */ target)
}

export const readFile = (path, encoding) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.readFile', /* path */ path, /* encoding */ encoding)
}

export const exists = (path, encoding) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.exists', /* path */ path)
}

export const readJson = (path) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.readJson', /* path */ path)
}

export const remove = (path) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.remove', /* path */ path)
}

export const rename = (oldUri, newUri) => {
  oldUri = toUri(oldUri)
  newUri = toUri(newUri)
  return FileSystemWorker.invoke('FileSystem.rename', /* oldPath */ oldUri, /* newPath */ newUri)
}

export const mkdir = (path) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.mkdir', /* path */ path)
}

export const writeFile = async (path, content, encoding) => {
  path = toUri(path)
  await FileSystemWorker.invoke(/* FileSystem.writeFile */ 'FileSystem.writeFile', /* path */ path, /* content */ content, /* encoding */ encoding)
}

export const writeBlob = async (path, blob) => {
  path = toUri(path)
  await FileSystemWorker.invoke('FileSystem.writeBlob', path, blob)
}

export const ensureFile = async () => {}

export const readDirWithFileTypes = (path) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.readDirWithFileTypes', /* path */ path)
}

export const getBlobUrl = (path) => {
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return GetRemoteSrc.getRemoteSrc(path)
}

export const getBlob = async (path, type) => {
  const content = await FileSystemWorker.invoke('FileSystem.readFileAsBuffer', path)
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
  return FileSystemWorker.invoke('FileSystem.getPathSeparator')
}

export const getRealPath = (path) => {
  return FileSystemWorker.invoke('FileSystem.getRealPath', /* path */ path)
}

export const stat = (path) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.stat', /* path */ path)
}

export const getFolderSize = (path) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.getFolderSize', /* path */ path)
}

export const chmod = (path, permissions) => {
  path = toUri(path)
  return FileSystemWorker.invoke('FileSystem.chmod', /* path */ path, /* permissions */ permissions)
}

export const canBeRestored = true
