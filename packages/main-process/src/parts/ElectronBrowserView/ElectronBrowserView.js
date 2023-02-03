const { BrowserView, BrowserWindow } = require('electron')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const Assert = require('../Assert/Assert.js')
const ElectronBrowserViewAdBlock = require('../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js')
const ElectronBrowserViewEventListeners = require('../ElectronBrowserViewEventListeners/ElectronBrowserViewEventListeners.js')

/**
 *
 * @param {number} restoreId
 * @returns
 */
exports.createBrowserView = async (restoreId) => {
  Assert.number(restoreId)
  const cached = ElectronBrowserViewState.get(restoreId)
  if (cached) {
    // console.log('[main-process] cached browser view', restoreId)
    return restoreId
  }
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return ElectronBrowserViewState.getAnyKey()
  }
  // console.log('[main-process] new browser view')
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })

  view.setBackgroundColor('#fff')

  const { webContents } = view
  const { id } = webContents
  // console.log('[main process] create browser view', id)
  ElectronBrowserViewState.add(id, browserWindow, view)

  /**
   *
   * @type {(details: Electron.HandlerDetails) => ({action: 'deny'}) | ({action: 'allow', overrideBrowserWindowOptions?: Electron.BrowserWindowConstructorOptions})} param0
   * @returns
   */
  const handleWindowOpen = ({ url, disposition, features, frameName, referrer, postBody, ...rest }) => {
    return ElectronBrowserViewEventListeners.handleWindowOpen(webContents, { url, disposition, features, frameName, referrer, postBody })
  }
  webContents.on('context-menu', ElectronBrowserViewEventListeners.handleContextMenu)
  webContents.on('will-navigate', ElectronBrowserViewEventListeners.handleWillNavigate)
  webContents.on('did-navigate', ElectronBrowserViewEventListeners.handleDidNavigate)
  webContents.on('page-title-updated', ElectronBrowserViewEventListeners.handlePageTitleUpdated)
  webContents.on('destroyed', ElectronBrowserViewEventListeners.handleDestroyed)
  webContents.on('before-input-event', ElectronBrowserViewEventListeners.handleBeforeInput)
  webContents.setWindowOpenHandler(handleWindowOpen)
  ElectronBrowserViewAdBlock.enableForWebContents(webContents)
  return id
}

/**
 *
 * @param {Electron.WebContents} webContents
 */
const disposeWebContents = (webContents) => {
  if (webContents.close) {
    // electron v22
    webContents.close()
    // @ts-ignore
  } else if (webContents.destroy) {
    // older versions of electron
    // @ts-ignore
    webContents.destroy()
  }
}

exports.disposeBrowserView = (id) => {
  console.log('[main process] dispose browser view', id)
  const { view, browserWindow } = ElectronBrowserViewState.get(id)
  ElectronBrowserViewState.remove(id)
  browserWindow.removeBrowserView(view)
  disposeWebContents(view.webContents)
}
