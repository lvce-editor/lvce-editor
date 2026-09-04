import * as Assert from '../Assert/Assert.ts'
import * as Command from '../Command/Command.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as GetFileSystem from '../GetFileSystem/GetFileSystem.js'
import * as GetProtocol from '../GetProtocol/GetProtocol.js'

const notifyFileSystemChanged = async (changes = {}, refreshWorkspaceViews = true) => {
  const effects = []
  if (refreshWorkspaceViews) {
    effects.push(Command.execute('Layout.handleWorkspaceRefresh', changes))
  }
  effects.push(Command.execute('Layout.refreshSourceControlBadgeCount'))
  await Promise.allSettled(effects)
}

export const readFile = async (uri, encoding = EncodingType.Utf8) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'untitled') {
    return ''
  }
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readFile(uri, encoding)
}

export const readJson = async (uri, encoding) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readJson(uri, encoding)
}

export const remove = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.remove(uri)
  await notifyFileSystemChanged({
    deleted: [uri],
  })
}

export const rename = async (oldUri, newUri) => {
  const protocol = GetProtocol.getProtocol(oldUri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.rename(oldUri, newUri)
  await notifyFileSystemChanged({
    renamed: [[oldUri, newUri]],
  })
}

export const mkdir = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.mkdir(uri)
}

export const writeFile = async (uri, content, encoding = EncodingType.Utf8, refreshWorkspaceViews = true) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.writeFile(uri, content, encoding)
  await notifyFileSystemChanged(
    {
      changed: [uri],
    },
    refreshWorkspaceViews,
  )
}

export const writeBlob = async (uri, blob) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  await fileSystem.writeBlob(uri, blob)
}

export const createFile = (uri) => {
  return writeFile(uri, '')
}

export const readDirWithFileTypes = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.readDirWithFileTypes(uri)
}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

export const getBlobUrl = async (uri, type = '') => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  if (fileSystem.getBlobSrc) {
    return fileSystem.getBlobSrc(uri, type)
  }
  if (fileSystem.getBlobUrl) {
    return fileSystem.getBlobUrl(uri, type)
  }
  throw new Error(`Filesystem doesn't support the getBlobUrl function`)
}

export const getBlob = async (uri, type) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getBlob(uri, type)
}

export const copy = async (sourceUri, targetUri) => {
  Assert.string(sourceUri)
  Assert.string(targetUri)
  // TODO what if it is not the same file system?
  const protocol = GetProtocol.getProtocol(sourceUri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.copy(sourceUri, targetUri)
}

export const isReadonly = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.isReadonly(uri)
}

export const getRealPath = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getRealPath(uri)
}

export const stat = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.stat(uri)
}

export const getFolderSize = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.getFolderSize(uri)
}

export const getFileSize = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  if (!fileSystem.getFileSize) {
    throw new Error(`File size is not supported for ${protocol} files`)
  }
  return fileSystem.getFileSize(uri)
}

export const chmod = async (uri, permissions) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.chmod(uri, permissions)
}

export const exists = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.exists(uri)
}

export const canBeRestored = async (uri) => {
  const protocol = GetProtocol.getProtocol(uri)
  if (protocol === 'storage-overview') {
    return true
  }
  if (protocol === 'extension-detail') {
    return true
  }
  if (protocol === 'screen-cast') {
    return true
  }
  if (protocol === 'diff') {
    return true
  }
  if (protocol === 'inline-diff') {
    return true
  }
  if (protocol === 'simple-browser') {
    return true
  }
  if (protocol === 'iframe-inspector') {
    return true
  }
  if (protocol === 'settings') {
    return true
  }
  const fileSystem = await GetFileSystem.getFileSystem(protocol)
  return fileSystem.canBeRestored
}
