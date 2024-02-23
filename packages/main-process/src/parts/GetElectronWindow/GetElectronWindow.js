import * as ElectronWindow from '../ElectronWindow/ElectronWindow.js'

export const getElectronWindow = (windowId) => {
  if (windowId === -1) {
    return ElectronWindow.getFocusedWindow()
  }
  return ElectronWindow.findById(windowId)
}
