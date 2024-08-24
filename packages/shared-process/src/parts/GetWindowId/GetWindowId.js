import * as Assert from '../Assert/Assert.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const getWindowId = (webContentsId) => {
  Assert.number(webContentsId)
  return ParentIpc.invoke('GetWindowId.getWindowId', webContentsId)
}
