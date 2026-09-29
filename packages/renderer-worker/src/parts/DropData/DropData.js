import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const get = (dropId, options) => {
  return RendererProcess.invoke('DropData.get', dropId, options)
}
