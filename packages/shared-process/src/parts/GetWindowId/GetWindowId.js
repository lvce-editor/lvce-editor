import * as Assert from '../Assert/Assert.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const getWindowId = (webContentsId = 1) => {
  Assert.number(webContentsId)
  return ParentIpc.invoke('GetWindowId.getWindowId', webContentsId)
}
