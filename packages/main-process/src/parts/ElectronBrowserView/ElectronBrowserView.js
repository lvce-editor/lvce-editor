const { BrowserView, BrowserWindow } = require('electron')
const Assert = require('../Assert/Assert.js')
const DisposeWebContents = require('../DisposeWebContents/DisposeWebContents.js')
const ElectronBrowserViewAdBlock = require('../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js')
const ElectronBrowserViewEventListeners = require('../ElectronBrowserViewEventListeners/ElectronBrowserViewEventListeners.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const ElectronWebContentsEventType = require('../ElectronWebContentsEventType/ElectronWebContentsEventType.js')

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
  webContents.on(ElectronWebContentsEventType.ContextMenu, ElectronBrowserViewEventListeners.handleContextMenu)
  webContents.on(ElectronWebContentsEventType.WillNavigate, ElectronBrowserViewEventListeners.handleWillNavigate)
  webContents.on(ElectronWebContentsEventType.DidNavigate, ElectronBrowserViewEventListeners.handleDidNavigate)
  webContents.on(ElectronWebContentsEventType.PageTitleUpdated, ElectronBrowserViewEventListeners.handlePageTitleUpdated)
  webContents.on(ElectronWebContentsEventType.Destroyed, ElectronBrowserViewEventListeners.handleDestroyed)
  webContents.on(ElectronWebContentsEventType.BeforeInputEvent, ElectronBrowserViewEventListeners.handleBeforeInput)
  webContents.setWindowOpenHandler(handleWindowOpen)
  ElectronBrowserViewAdBlock.enableForWebContents(webContents)
  return id
}

exports.disposeBrowserView = (id) => {
  console.log('[main process] dispose browser view', id)
  const { view, browserWindow } = ElectronBrowserViewState.get(id)
  ElectronBrowserViewState.remove(id)
  browserWindow.removeBrowserView(view)
  DisposeWebContents.disposeWebContents(view.webContents)
}
