import * as BrowserErrorTypes from '../BrowserErrorTypes/BrowserErrorTypes.js'
import * as FileHandleEditMode from '../FileHandleEditMode/FileHandleEditMode.js'
import * as FileHandlePermissionType from '../FileHandlePermissionType/FileHandlePermissionType.js'
import * as FileSystemHandle from '../FileSystemHandle/FileSystemHandle.js'
import * as FileSytemHandlePermission from '../FileSystemHandlePermission/FileSystemHandlePermission.js'
import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'
import { VError } from '../VError/VError.js'

const pathSeparator = '/'

const readDirWithFileTypesFallbackPrompt = async (handle) => {
  // TODO cannot prompt without user activation, else error occurs
  // maybe need to show
  const permissionTypeNow = await FileSytemHandlePermission.requestPermission(
    handle,
    {
      mode: FileHandleEditMode.ReadWrite,
    }
  )
  switch (permissionTypeNow) {
    case FileHandlePermissionType.Granted:
      return FileSystemHandle.getDirents(handle)
    case FileHandlePermissionType.Prompt:
    case FileHandlePermissionType.Denied:
      // TODO maybe throw error in this case
      return []
    default:
      return []
  }
}

const readDirWithFileTypesFallback = async (uri) => {
  try {
    const handle = await PersistentFileHandle.getHandle(uri)
    const permissionType = await FileSytemHandlePermission.queryPermission(
      handle,
      {
        mode: FileHandleEditMode.ReadWrite,
      }
    )
    switch (permissionType) {
      case FileHandlePermissionType.Granted:
        throw new VError(`invalid state`)
      case FileHandlePermissionType.Prompt:
        return await readDirWithFileTypesFallbackPrompt(handle)
      case FileHandlePermissionType.Denied:
        return []
      default:
        return []
    }
  } catch (error) {
    throw new VError(error, `failed to read directory`)
  }
}

export const readDirWithFileTypes = async (uri) => {
  try {
    // TODO convert uri to file handle path, get file handle from indexeddb
    // if file handle does not exist, throw error
    const handle = await PersistentFileHandle.getHandle(uri)
    if (!handle) {
      throw new Error(`File system handle not found for ${uri}`)
    }
    const childHandles = await FileSystemHandle.getChildHandles(handle)
    for (const childHandle of childHandles) {
      const childUri = uri + pathSeparator + childHandle.name
      await PersistentFileHandle.addHandle(childUri, childHandle)
    }
    const dirents = FileSystemHandle.getDirents(childHandles)
    return dirents
  } catch (error) {
    if (BrowserErrorTypes.isNotAllowedError(error)) {
      return readDirWithFileTypesFallback(uri)
    }
    throw new VError(error, `failed to read directory`)
  }
}

const getDirectoryHandle = async (uri) => {
  const handle = await PersistentFileHandle.getHandle(uri)
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
  const handle = await PersistentFileHandle.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.getDirName(pathSeparator, uri)
  const parentHandle = await getDirectoryHandle(dirname)
  if (!parentHandle) {
    return undefined
  }
  const baseName = Path.getBaseName(pathSeparator, uri)
  const fileHandle = FileSystemHandle.getFileHandle(parentHandle, baseName)
  return fileHandle
}

export const readFile = async (uri) => {
  try {
    const handle = await getFileHandle(uri)
    if (!handle) {
      throw new VError(`File not found ${uri}`)
    }
    const file = await FileSystemHandle.getFile(handle)
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
    await FileSystemHandle.write(handle, content)
  } catch (error) {
    throw new VError(error, `Failed to save file`)
  }
}

export const getPathSeparator = () => {
  return pathSeparator
}

// not possible because FileHandle permissions are on preserved on reload
export const canBeRestored = false
