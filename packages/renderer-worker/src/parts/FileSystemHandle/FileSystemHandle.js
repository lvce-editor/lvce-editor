import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getFileHandles = (ids) => {
  return RendererProcess.invoke('FileHandles.get', ids)
}

export const addFileHandle = (fileHandle) => {
  return RendererProcess.invoke('FileHandles.addFileHandle', fileHandle)
}
