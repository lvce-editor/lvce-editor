import * as Arrays from '../Arrays/Arrays.js'
import * as Assert from '../Assert/Assert.js'
import * as FileHandleTypeMap from '../FileHandleTypeMap/FileHandleTypeMap.js'

export const getFile = (handle) => {
  return handle.getFile()
}

export const write = async (handle, content) => {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}

const getDirent = (handle) => {
  const { name, kind } = handle
  const type = FileHandleTypeMap.getDirentType(kind)
  return {
    name,
    type,
  }
}

export const getChildHandles = async (handle) => {
  Assert.object(handle)
  const handles = await Arrays.fromAsync(handle.values())
  return handles
}

export const getDirents = (handles) => {
  const dirents = handles.map(getDirent)
  return dirents
}

export const getFileHandle = (handle, name) => {
  return handle.getFileHandle(name)
}
