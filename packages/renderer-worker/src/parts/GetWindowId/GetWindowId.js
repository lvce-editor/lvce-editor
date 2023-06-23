import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

// TODO cache window id

export const getWindowId = async () => {
  const windowId = await ElectronProcess.invoke('GetWindowId.getWindowId')
  return windowId
}
