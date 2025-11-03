import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getSelectionText = () => {
  return RendererProcess.invoke('Css.getSelectionText')
}
