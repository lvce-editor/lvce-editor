import * as Arrays from '../Arrays/Arrays.js'
import * as Command from '../Command/Command.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as FileHandleType from '../FileHandleType/FileHandleType.js'

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

export const readDirWithFileTypes = async (uri) => {
  console.log(uri)
  // TODO convert uri to file handle path, get file handle from indexeddb
  // if file handle does not exist, throw error
  const handle = await Command.execute('FileHandle.getHandle', uri)
  const children = await Arrays.fromAsync(handle, getDirent)
  return children
}

export const readFile = (uri) => {
  throw new Error('not implemented')
}

export const writeFile = (uri) => {
  throw new Error('not implemented')
}

export const getPathSeparator = () => {
  return '/'
}
