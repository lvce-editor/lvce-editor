import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as WebContentsId from '../WebContentsId/WebContentsId.js'

// TODO cache window id

export const getWindowId = async () => {
  const webContentsId = WebContentsId.get()
  const windowId = await SharedProcess.invoke('GetWindowId.getWindowId', webContentsId)
  return windowId
}
