import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'
import * as GetDirectoryHandle from '../GetDirectoryHandle/GetDirectoryHandle.js'
import { VError } from '../VError/VError.js'

const searchFilesRecursively = async (all, parent, handle) => {
  const childHandles = await FileSystemDirectoryHandle.getChildHandles(handle)
  const promises = []
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
  const handle = await GetDirectoryHandle.getDirectoryHandle(path)
  if (!handle) {
    throw new VError(`Folder not found ${uri}`)
  }
  const all = []
  await searchFilesRecursively(all, '', handle)
  return all
}
