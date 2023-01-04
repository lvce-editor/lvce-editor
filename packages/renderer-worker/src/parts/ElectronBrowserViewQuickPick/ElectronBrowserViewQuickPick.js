import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const createBrowserViewQuickPick = (x, y, width, height) => {
  return ElectronProcess.invoke('ElectronBrowserViewQuickPick.createBrowserViewQuickPick', x, y, width, height)
}

export const disposeBrowserViewQuickPick = () => {
  return ElectronProcess.invoke('ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick')
}
