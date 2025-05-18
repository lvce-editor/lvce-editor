import * as ParentIpc from '../MainProcess/MainProcess.js'

export const getSources = (options) => {
  return ParentIpc.invoke('DesktopCapturer.getSources', options)
}
