import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'
import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'
import { VError } from '../VError/VError.js'

const getDirectoryHandle = async (uri) => {
  const handle = await PersistentFileHandle.getHandle(uri)
  if (handle) {
    return handle
  }
  const dirname = Path.dirname('/', uri)
  if (uri === dirname) {
    return undefined
  }
  return getDirectoryHandle(dirname)
}

const searchFilesRecursively = async (all, parent, handle) => {
  const childHandles = await FileSystemDirectoryHandle.getChildHandles(handle)
  const promises = []
  for (const childHandle of childHandles) {
    const absolutePath = parent + '/' + childHandle.name
    if (childHandle.kind === FileHandleType.Directory) {
      promises.push(searchFilesRecursively(all, absolutePath, childHandle))
    }
    if (childHandle.kind === FileHandleType.File) {
      all.push(absolutePath)
    }
  }
  await Promise.all(promises)
}

export const searchFile = async (uri) => {
  const path = uri.slice('html://'.length)
  const handle = await getDirectoryHandle(path)
  if (!handle) {
    throw new VError(`Folder not found ${uri}`)
  }
  const all = []
  await searchFilesRecursively(all, '', handle)
  return all
}
