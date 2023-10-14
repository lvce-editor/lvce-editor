import * as Assert from '../Assert/Assert.js'

export const getWindowId = (ipc) => {
  Assert.object(ipc)
  return ipc.windowId
}
