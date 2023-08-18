import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getSources = async (options) => {
  const sources = await SharedProcess.invoke('DesktopCapturer.getSources', options)
  return sources
}
