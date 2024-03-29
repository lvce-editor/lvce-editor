import * as Electron from 'electron'
import { BrowserView, BrowserWindow } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as ElectronBrowserViewAdBlock from '../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js'
import * as ElectronBrowserViewEventListeners from '../ElectronBrowserViewEventListeners/ElectronBrowserViewEventListeners.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronSessionForBrowserView from '../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const createBrowserView2 = () => {
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  // TODO get browser window id from renderer worker
  const browserWindow = BrowserWindow.getFocusedWindow()
  const { webContents } = view
  const { id } = webContents
  ElectronBrowserViewState.add(id, browserWindow, view)
  return id
}

export const attachEventListeners = (webContentsId) => {
  Assert.number(webContentsId)
  const webContents = Electron.webContents.fromId(webContentsId)
  if (!webContents) {
    return
  }
  const values = Object.values(ElectronBrowserViewEventListeners)
  for (const value of values) {
    const wrappedListener = (...args) => {
      const { result, messages } = value.handler(...args)
      for (const message of messages) {
        const [key, ...rest] = message
        SharedProcess.send(`ElectronWebContents.${key}`, webContentsId, ...rest)
      }
      return result
    }
    // TODO detached listeners when webcontents are disposed
    // to avoid potential memory leaks
    value.attach(webContents, wrappedListener)
  }
  ElectronBrowserViewAdBlock.enableForWebContents(webContents)
}

export const disposeBrowserView = (browserViewId) => {
  console.log('[main process] dispose browser view', browserViewId)
  const { view, browserWindow } = ElectronBrowserViewState.get(browserViewId)
  ElectronBrowserViewState.remove(browserViewId)
  browserWindow.removeBrowserView(view)
}
