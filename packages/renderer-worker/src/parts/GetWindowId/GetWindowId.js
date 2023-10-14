import * as SharedProcess from '../SharedProcess/SharedProcess.js'

// TODO cache window id

export const getWindowId = async () => {
  const windowId = await SharedProcess.invoke('GetWindowId.getWindowId')
  return windowId
}
