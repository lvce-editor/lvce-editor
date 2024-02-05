import * as Electron from 'electron'
import { BrowserView, BrowserWindow } from 'electron'
import * as ElectronBrowserViewAdBlock from '../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js'
import * as ElectronBrowserViewEventListeners from '../ElectronBrowserViewEventListeners/ElectronBrowserViewEventListeners.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronSessionForBrowserView from '../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js'
import * as Logger from '../Logger/Logger.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 *
 * @param {number} id
 * @returns {any}
 */
export const getPort = (id) => {
  Logger.info('[main process] no message port found')
  return undefined
}

export const createBrowserView2 = (browserViewId) => {
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
        SharedProcess.send(`ElectronWebContents.${key}`, ...rest)
      }
      return result
    }
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

const getBrowserViewId = (browserView) => {
  return browserView.webContents.id
}

export const getAll = () => {
  const windows = BrowserWindow.getAllWindows()
  const overview = Object.create(null)
  for (const window of windows) {
    const views = window.getBrowserViews()
    const viewIds = views.map(getBrowserViewId)
    overview[window.id] = viewIds
  }
  return overview
}
