import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getFileHandles = (ids) => {
  return RendererProcess.invoke('FileHandles.get', ids)
}
