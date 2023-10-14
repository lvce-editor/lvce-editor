import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const createBrowserViewQuickPick = (x, y, width, height) => {
  return ParentIpc.invoke('ElectronBrowserViewQuickPick.createBrowserViewQuickPick', x, y, width, height)
}

export const disposeBrowserViewQuickPick = () => {
  return ParentIpc.invoke('ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick')
}
