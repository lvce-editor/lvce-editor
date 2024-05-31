import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getFilePathElectron = (file) => {
  return RendererProcess.invokeAndTransfer('GetFilePathElectron.getFilePathElectron', file)
}
