import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const getSources = (options) => {
  return ParentIpc.invoke('DesktopCapturer.getSources', options)
}
