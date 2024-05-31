import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const getFilePathElectron = async (file) => {
  return RendererProcess.invoke('GetFilePathElectron.getFilePathElectron', file)
}
