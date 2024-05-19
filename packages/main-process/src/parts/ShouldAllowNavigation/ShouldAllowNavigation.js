import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'

export const shouldAllowNavigation = (webContentsId) => {
  if (ElectronWebContentsViewState.hasWebContents(webContentsId)) {
    return true
  }
  return false
}
