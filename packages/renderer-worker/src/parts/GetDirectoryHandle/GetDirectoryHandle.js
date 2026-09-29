import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'
import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'

const pathSeparator = '/'

export const getDirectoryHandleWithDependencies = async (uri, dependencies) => {
  const handle = await dependencies.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.dirname(pathSeparator, uri)
  if (uri === dirname) {
    return undefined
  }
  const parentHandle = await getDirectoryHandleWithDependencies(dirname, dependencies)
  if (!parentHandle) {
    return undefined
  }
  const baseName = Path.getBaseName(pathSeparator, uri)
  const directoryHandle = await dependencies.getDirectoryHandle(parentHandle, baseName)
  await dependencies.addHandle(uri, directoryHandle)
  return directoryHandle
}

export const getDirectoryHandle = async (uri) => {
  return getDirectoryHandleWithDependencies(uri, {
    addHandle: PersistentFileHandle.addHandle,
    getDirectoryHandle: FileSystemDirectoryHandle.getDirectoryHandle,
    getHandle: PersistentFileHandle.getHandle,
  })
}
