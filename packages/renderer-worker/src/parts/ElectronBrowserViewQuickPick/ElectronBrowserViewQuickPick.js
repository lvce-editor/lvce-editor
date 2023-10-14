import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const createBrowserViewQuickPick = (x, y, width, height) => {
  return SharedProcess.invoke('ElectronBrowserViewQuickPick.createBrowserViewQuickPick', x, y, width, height)
}

export const disposeBrowserViewQuickPick = () => {
  return SharedProcess.invoke('ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick')
}
