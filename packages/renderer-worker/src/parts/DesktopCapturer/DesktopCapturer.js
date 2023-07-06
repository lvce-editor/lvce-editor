import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const getSources = async (options) => {
  const sources = await ElectronProcess.invoke('DesktopCapturer.getSources', options)
  return sources
}
