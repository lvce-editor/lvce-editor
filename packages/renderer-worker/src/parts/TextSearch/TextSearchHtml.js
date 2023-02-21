import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as FileSystemDirectoryHandle from '../FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'
import * as Path from '../Path/Path.js'
import * as PersistentFileHandle from '../PersistentFileHandle/PersistentFileHandle.js'
import { VError } from '../VError/VError.js'
import * as FileSystemFileHandle from '../FileSystemFileHandle/FileSystemFileHandle.js'

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

const textSearchInText = (all, file, content, query) => {}

const textSearchInFile = async (all, handle, absolutePath, query) => {
  const content = await FileSystemFileHandle.getBinaryString(handle)
  textSearchInText(all, absolutePath, content, query)
}

const textSearchRecursively = async (all, parent, handle, query) => {
  const childHandles = await FileSystemDirectoryHandle.getChildHandles(handle)
  const promises = []
  for (const childHandle of childHandles) {
    const absolutePath = parent + '/' + childHandle.name
    if (childHandle.kind === FileHandleType.Directory) {
      promises.push(textSearchRecursively(all, absolutePath, childHandle))
    }
    if (childHandle.kind === FileHandleType.File) {
      promises.push(textSearchInFile(all, handle, absolutePath, query))
    }
  }
  await Promise.all(promises)
}

export const textSearch = async (scheme, root, query) => {
  const relativeRoot = root.slice('html://'.length)
  const handle = await getDirectoryHandle(relativeRoot)
  if (!handle) {
    throw new VError(`Folder not found ${relativeRoot}`)
  }
  const all = []
  await textSearchRecursively(all, '', handle, query)
  return all
}
