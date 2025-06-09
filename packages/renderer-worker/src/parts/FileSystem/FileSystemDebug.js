import * as DebugWorker from '../DebugWorker/DebugWorker.js'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.js'

export const name = 'Debug'

export const readFile = (uri) => {
  return DebugWorker.invoke('RunAndDebug.readFile', uri)
}

export const writeFile = (uri, content) => {
  throw new Error('not implemented')
}

export const mkdir = (uri) => {
  throw new Error('not implemented')
}

export const getPathSeparator = () => {
  return PathSeparatorType.Slash
}

export const remove = (uri) => {
  throw new Error('not implemented')
}

export const readDirWithFileTypes = (uri) => {
  throw new Error('not implemented')
}

export const getBlobUrl = (uri) => {
  throw new Error('not implemented')
}

export const getBlob = async (uri) => {
  throw new Error('not implemented')
}

export const chmod = (path, permissions) => {
  throw new Error('not implemented')
}

export const rename = (oldPath, newPath) => {
  throw new Error('not implemented')
}

export const getFiles = () => {
  throw new Error('not implemented')
}
