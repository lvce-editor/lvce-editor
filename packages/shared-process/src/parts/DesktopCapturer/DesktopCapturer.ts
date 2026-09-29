import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getSources = (options: any): any => {
  return ParentIpc.invoke('DesktopCapturer.getSources', options)
}
