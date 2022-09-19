import * as Arrays from '../Arrays/Arrays.js'
import * as BrowserErrorTypes from '../BrowserErrorTypes/BrowserErrorTypes.js'
import * as Command from '../Command/Command.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileHandlePermissionType from '../FileHandlePermissionType/FileHandlePermissionType.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as Path from '../Path/Path.js'
import { VError } from '../VError/VError.js'

const pathSeparator = '/'

const getDirentType = (fileHandle) => {
  switch (fileHandle.kind) {
    case FileHandleType.Directory:
      return DirentType.Directory
    case FileHandleType.File:
      return DirentType.File
    default:
      return DirentType.Unknown
  }
}

const getDirent = ([name, child]) => {
  const type = getDirentType(child)
  return {
    name,
    type,
  }
}

const getDirents = async (handle) => {
  const children = await Arrays.fromAsync(handle, getDirent)
  return children
}

const getHandle = async (uri) => {
  const handle = await Command.execute('FileHandle.getHandle', uri)
  return handle
}

const readDirWithFileTypesFallbackPrompt = async (handle) => {
  const permissionTypeNow = await FileSystemHandle.requestPermission(handle, {
    mode: 'readwrite',
  })
  switch (permissionTypeNow) {
    case FileHandlePermissionType.Granted:
      return getDirents(handle)
    case FileHandlePermissionType.Prompt:
    case FileHandlePermissionType.Denied:
      // TODO maybe throw error in this case
      return []
    default:
      return []
  }
}

const readDirWithFileTypesFallback = async (uri) => {
  const handle = await getHandle(uri)
  const permissionType = await handle.queryPermission({ mode: 'readwrite' })
  switch (permissionType) {
    case FileHandlePermissionType.Granted:
      throw new VError(`failed to read dir with file types`)
    case FileHandlePermissionType.Prompt:
      return readDirWithFileTypesFallbackPrompt(handle)
    case FileHandlePermissionType.Denied:
      return []
    default:
      return []
  }
}

export const readDirWithFileTypes = async (uri) => {
  try {
    // TODO convert uri to file handle path, get file handle from indexeddb
    // if file handle does not exist, throw error
    const handle = await getHandle(uri)
    const children = await getDirents(handle)
    return children
  } catch (error) {
    if (BrowserErrorTypes.isNotAllowedError(error)) {
      return readDirWithFileTypesFallback(uri)
    }
    throw new VError(error, `failed to read dir with file types`)
  }
}

const getDirectoryHandle = async (uri) => {
  const handle = await getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.getDirName(pathSeparator, uri)
  if (uri === dirname) {
    return undefined
  }
  return getDirectoryHandle(dirname)
}

const getFileHandle = async (uri) => {
  const handle = await getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.getDirName(pathSeparator, uri)
  const parentHandle = await getDirectoryHandle(dirname)
  if (!parentHandle) {
    return undefined
  }
  const baseName = Path.getBaseName(pathSeparator, uri)
  const fileHandle = parentHandle.getFileHandle(baseName)
  return fileHandle
}

export const readFile = async (uri) => {
  try {
    const handle = await getFileHandle(uri)
    if (!handle) {
      throw new VError(`File not found ${uri}`)
    }
    const file = await handle.getFile()
    const text = await file.text()
    return text
  } catch (error) {
    throw new VError(error, `Failed to read file`)
  }
}

export const writeFile = async (uri, content) => {
  try {
    const handle = await getFileHandle(uri)
    if (!handle) {
      throw new VError(`File not found ${uri}`)
    }
    const writable = await handle.createWritable()
    await writable.write(content)
    await writable.close()
  } catch (error) {
    throw new VError(error, `Failed to save file`)
  }
}

export const getPathSeparator = () => {
  return pathSeparator
}
