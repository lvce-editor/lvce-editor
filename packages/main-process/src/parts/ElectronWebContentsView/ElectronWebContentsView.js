import { BrowserView, BrowserWindow } from 'electron'
import * as ElectronSessionForBrowserView from '../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js'
import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'

// TODO use electron 30 webcontentsview api
export const createWebContentsView = async () => {
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  console.log(view)
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

export const disposeWebContentsView = (webContentsId) => {
  // TODO
}
