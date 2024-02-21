import { BrowserWindow } from 'electron'
import * as ElectronSessionForBrowserView from '../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js'
import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'

// TODO use electron 29 webcontentsview api
export const createWebContentsView = async () => {
  const { WebContentsView } = await import('electron')
  const view = new WebContentsView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  // TODO get browser window id from renderer worker
  const browserWindow = BrowserWindow.getFocusedWindow()
  const { webContents } = view
  const { id } = webContents
  ElectronWebContentsViewState.add(id, browserWindow, view)
  return id
}

export const attachEventListeners = (webContentsId) => {
  // TODO
}

export const disposeWebContentsView = (browserViewId) => {
  // TODO
}
