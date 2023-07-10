const { BrowserView, BrowserWindow } = require('electron')
const Assert = require('../Assert/Assert.cjs')
const DisposeWebContents = require('../DisposeWebContents/DisposeWebContents.js')
const ElectronBrowserViewAdBlock = require('../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.cjs')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const ElectronWebContentsEventType = require('../ElectronWebContentsEventType/ElectronWebContentsEventType.cjs')
const ElectronDispositionType = require('../ElectronDispositionType/ElectronDispositionType.js')
const ElectronWindowOpenActionType = require('../ElectronWindowOpenActionType/ElectronWindowOpenActionType.cjs')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.cjs')
const ElectronInputType = require('../ElectronInputType/ElectronInputType.js')
const Debug = require('../Debug/Debug.cjs')
const Logger = require('../Logger/Logger.cjs')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.cjs')

const normalizeKey = (key) => {
  if (key === ' ') {
    return 'Space'
  }
  if (key.length === 1) {
    return key.toLowerCase()
  }
  return key
}

const getIdentifier = (input) => {
  let identifier = ''
  if (input.control) {
    identifier += 'ctrl+'
  }
  if (input.shift) {
    identifier += 'shift+'
  }
  if (input.alt) {
    identifier += 'alt+'
  }
  if (input.meta) {
    identifier += 'meta+'
  }
  identifier += normalizeKey(input.key)
  return identifier
}

/**
 *
 * @param {number} id
 */
const getPort = (exports.getPort = (id) => {
  const state = AppWindowStates.findByWindowId(id)
  if (!state) {
    Logger.info('[main process] no message port found')
    return undefined
  }
  const { port } = state
  return port
})

/**
 *
 * @param {number} restoreId
 * @returns
 */
exports.createBrowserView = async (restoreId, uid) => {
  Assert.number(restoreId)
  Assert.number(uid)
  const cached = ElectronBrowserViewState.get(restoreId)
  if (cached) {
    // console.log('[main-process] cached browser view', restoreId)
    return restoreId
  }
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return ElectronBrowserViewState.getAnyKey()
  }
  const browserWindowId = browserWindow.webContents.id
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
   * @type {(details: Electron.HandlerDetails) => ({action: 'deny'}) | ({action: 'allow', overrideBrowserWindowOptions?: Electron.BrowserWindowConstructorOptions})} param1
   * @returns
   */
  const handleWindowOpen = ({ url, disposition, features, frameName, referrer, postBody }) => {
    // TODO maybe need to put this function into a closure
    if (url === 'about:blank') {
      return { action: ElectronWindowOpenActionType.Allow }
    }
    // console.log({ disposition, features, frameName, referrer, postBody })
    if (disposition === ElectronDispositionType.BackgroundTab) {
      // TODO open background tab
      const port = getPort(browserWindowId)
      if (!port) {
        Logger.warn('[main process] handlwWindowOpen - no port found')
        return {
          action: ElectronWindowOpenActionType.Deny,
        }
      }
      port.postMessage({
        jsonrpc: JsonRpcVersion.Two,
        method: 'Viewlet.executeViewletCommand',
        params: [uid, 'openBackgroundTab', url],
      })
      return {
        action: ElectronWindowOpenActionType.Deny,
      }
    }
    if (disposition === ElectronDispositionType.NewWindow) {
      return {
        action: ElectronWindowOpenActionType.Allow,
      }
    }
    Logger.info(`[main-process] blocked popup for ${url}`)
    return {
      action: ElectronWindowOpenActionType.Deny,
    }
  }

  /**
   * @param {Electron.Event} event
   * @param {string} url
   */
  const handleWillNavigate = (event, url) => {
    Debug.debug(`[main-process] will navigate to ${url}`)
    // console.log({ event, url })
    const canGoForward = webContents.canGoForward()
    const canGoBack = webContents.canGoBack()
    const port = getPort(browserWindowId)
    if (!port) {
      Logger.info('[main-process] view will navigate to ', url)
      return
    }
    port.postMessage({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Viewlet.executeViewletCommand',
      params: [uid, 'handleWillNavigate', url, canGoBack, canGoForward],
    })
  }
  /**
   * @param {Electron.Event} event
   * @param {string} url
   */
  const handleDidNavigate = (event, url) => {
    Debug.debug(`[main-process] did navigate to ${url}`)
    console.log(`[main-process] did navigate to ${url}`)
    const canGoForward = webContents.canGoForward()
    const canGoBack = webContents.canGoBack()
    const port = getPort(browserWindowId)
    if (!port) {
      Logger.info('[main-process] view did navigate to ', url)
      return
    }
    port.postMessage({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Viewlet.executeViewletCommand',
      params: [uid, 'handleDidNavigate', url, canGoBack, canGoForward],
    })
  }

  /**
   *
   * @param {Electron.Event} event
   * @param {Electron.ContextMenuParams} params
   */
  const handleContextMenu = (event, params) => {
    const port = getPort(browserWindowId)
    if (!port) {
      return
    }
    port.postMessage({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Viewlet.executeViewletCommand',
      params: [uid, 'handleContextMenu', params],
    })
  }

  const handlePageTitleUpdated = (event, title) => {
    const port = getPort(browserWindowId)
    if (!port) {
      Logger.info('[main-process] view will change title to ', title)
      return
    }
    port.postMessage({
      jsonrpc: JsonRpcVersion.Two,
      method: 'Viewlet.executeViewletCommand',
      params: [uid, 'handleTitleUpdated', title],
    })
  }

  /**
   * @param {Electron.Event} event
   * @param {Electron.Input} input
   */
  const handleBeforeInput = (event, input) => {
    if (input.type !== ElectronInputType.KeyDown) {
      return
    }
    const falltroughKeyBindings = [] // TODO
    const port = getPort(browserWindowId)
    const identifier = getIdentifier(input)
    for (const fallThroughKeyBinding of falltroughKeyBindings) {
      if (fallThroughKeyBinding.key === identifier) {
        event.preventDefault()
        port.postMessage({
          jsonrpc: JsonRpcVersion.Two,
          method: fallThroughKeyBinding.command,
          params: fallThroughKeyBinding.args || [],
        })
        return
      }
    }
  }

  const handleDestroyed = (event) => {
    Debug.debug(`[main process] browser view ${webContents.id} destroyed`)
    ElectronBrowserViewState.remove(webContents.id)
  }

  webContents.on(ElectronWebContentsEventType.ContextMenu, handleContextMenu)
  webContents.on(ElectronWebContentsEventType.WillNavigate, handleWillNavigate)
  webContents.on(ElectronWebContentsEventType.DidNavigate, handleDidNavigate)
  webContents.on(ElectronWebContentsEventType.PageTitleUpdated, handlePageTitleUpdated)
  webContents.on(ElectronWebContentsEventType.Destroyed, handleDestroyed)
  webContents.on(ElectronWebContentsEventType.BeforeInputEvent, handleBeforeInput)
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

const getBrowserViewId = (browserView) => {
  return browserView.webContents.id
}

exports.getAll = () => {
  const windows = BrowserWindow.getAllWindows()
  const overview = Object.create(null)
  for (const window of windows) {
    const views = window.getBrowserViews()
    const viewIds = views.map(getBrowserViewId)
    overview[window.id] = viewIds
  }
  return overview
}
