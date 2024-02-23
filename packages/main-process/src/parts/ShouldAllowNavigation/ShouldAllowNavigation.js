import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'

export const shouldAllowNavigation = (webContentsId) => {
  if (ElectronBrowserViewState.hasWebContents(webContentsId)) {
    return true
  }
  if (ElectronWebContentsViewState.hasWebContents(webContentsId)) {
    return true
  }
  return false
}
