import * as Assert from '../Assert/Assert.ts'
import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getWindowId = (webContentsId: any): any => {
  Assert.number(webContentsId)
  return ParentIpc.invoke('GetWindowId.getWindowId', webContentsId)
}
