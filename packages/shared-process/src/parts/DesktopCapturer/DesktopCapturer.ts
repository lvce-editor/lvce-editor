import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getSources = (options) => {
  return ParentIpc.invoke('DesktopCapturer.getSources', options)
}
