import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'
import * as GetDirectoryHandle from '../GetDirectoryHandle/GetDirectoryHandle.js'
import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'

const pathSeparator = '/'

export const getFileHandle = async (uri) => {
  const handle = await PersistentFileHandle.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.dirname(pathSeparator, uri)
  const parentHandle = await GetDirectoryHandle.getDirectoryHandle(dirname)
  if (!parentHandle) {
    return undefined
  }
  const baseName = Path.getBaseName(pathSeparator, uri)
  const fileHandle = await FileSystemDirectoryHandle.getFileHandle(parentHandle, baseName)
  return fileHandle
}
