import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const reloadWeb = () => {
  return RendererProcess.invoke('Window.reload')
}
