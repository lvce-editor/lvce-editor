import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const getSources = () => {
  return ParentIpc.invoke('DesktopCapturer.getSources')
}
