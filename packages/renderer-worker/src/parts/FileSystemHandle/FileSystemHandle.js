import * as Arrays from '../Arrays/Arrays.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const requestPermission = async (handle, options) => {
  // query permission, but from renderer process
  // because handle.requestPermission is not implemented
  // in a worker, see https://github.com/WICG/file-system-access/issues/289
  const permissionTypeNow = await RendererProcess.invoke(
    'FileSystemHandle.requestPermission',
    handle,
    options
  )
  return permissionTypeNow
}

export const queryPermission = async (handle, options) => {
  return handle.queryPermission(options)
}

export const getFile = (handle) => {
  return handle.getFile()
}

export const write = async (handle, content) => {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

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

export const getDirents = async (handle) => {
  const children = await Arrays.fromAsync(handle, getDirent)
  return children
}

export const getFileHandle = (handle, name) => {
  return handle.getFileHandle(name)
}
