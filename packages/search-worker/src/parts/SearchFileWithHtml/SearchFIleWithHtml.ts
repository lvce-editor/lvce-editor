import * as FileHandleType from '../FileHandleType/FileHandleType.ts'
import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.ts'
import * as Path from '../Path/Path.ts'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.ts'
import { VError } from '../VError/VError.ts'

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
  const promises: any[] = []
  for (const childHandle of childHandles) {
    const absolutePath = parent + '/' + childHandle.name
    switch (childHandle.kind) {
      case FileHandleType.Directory:
        promises.push(searchFilesRecursively(all, absolutePath, childHandle))
        break
      case FileHandleType.File:
        all.push(absolutePath)
        break
      default:
        break
    }
  }
  await Promise.all(promises)
}

export const searchFile = async (uri) => {
  const path = uri.slice('html://'.length)
  const handle = await getDirectoryHandle(path)
  if (!handle) {
    // @ts-ignore
    throw new VError(`Folder not found ${uri}`)
  }
  const all = []
  await searchFilesRecursively(all, '', handle)
  return all
}
