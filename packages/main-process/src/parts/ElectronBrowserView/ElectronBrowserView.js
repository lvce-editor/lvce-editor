const { BrowserView, BrowserWindow, webContents } = require('electron')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const ElectronDispositionType = require('../ElectronDispositionType/ElectronDispositionType.js')
const ElectronWindowOpenActionType = require('../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js')
const ElectronBrowserViewCss = require('../ElectronBrowserViewCss/ElectronBrowserViewCss.js')
const Assert = require('../Assert/Assert.js')
const ElectronInputType = require('../ElectronInputType/ElectronInputType.js')
const Debug = require('../Debug/Debug.js')
const ElectronBrowserViewAdBlock = require('../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js')

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
 * @param {Electron.WebContents} webContents
 */
const getPort = (webContents) => {
  const browserWindow = ElectronBrowserViewState.getWindow(webContents)
  const state = AppWindowStates.findById(browserWindow.webContents.id)
  if (!state) {
    console.info('[main process] no message port found')
    return undefined
  }
  const { port } = state
  return port
}

/**
 * @param {Electron.Event} event
 * @param {string} url
 */
const handleWillNavigate = (event, url) => {
  Debug.debug(`[main-process] will navigate to ${url}`)
  // console.log({ event, url })
  const webContents = event.sender
  const canGoForward = webContents.canGoForward()
  const canGoBack = webContents.canGoBack()
  const port = getPort(webContents)
  if (!port) {
    console.info('[main-process] view will navigate to ', url)
    return
  }
  port.postMessage({
    jsonrpc: '2.0',
    method: 'Viewlet.executeViewletCommand',
    params: [
      'SimpleBrowser',
      'browserViewId',
      webContents.id,
      'handleWillNavigate',
      url,
      canGoBack,
      canGoForward,
    ],
  })
}
/**
 * @param {Electron.Event} event
 * @param {string} url
 */
const handleDidNavigate = (event, url) => {
  Debug.debug(`[main-process] did navigate to ${url}`)
  console.log(`[main-process] did navigate to ${url}`)
  const webContents = event.sender
  const canGoForward = webContents.canGoForward()
  const canGoBack = webContents.canGoBack()
  const port = getPort(webContents)
  if (!port) {
    console.info('[main-process] view did navigate to ', url)
    return
  }
  port.postMessage({
    jsonrpc: '2.0',
    method: 'Viewlet.executeViewletCommand',
    params: [
      'SimpleBrowser',
      'browserViewId',
      webContents.id,
      'handleDidNavigate',
      url,
      canGoBack,
      canGoForward,
    ],
  })
}

/**
 *
 * @param {Electron.Event} event
 * @param {Electron.ContextMenuParams} params
 */
const handleContextMenu = (event, params) => {
  const webContents = event.sender
  const port = getPort(webContents)
  if (!port) {
    return
  }
  port.postMessage({
    jsonrpc: '2.0',
    method: 'Viewlet.executeViewletCommand',
    params: [
      'SimpleBrowser',
      'browserViewId',
      webContents.id,
      'handleContextMenu',
      params,
    ],
  })
}

const handlePageTitleUpdated = (event, title) => {
  const webContents = event.sender
  const port = getPort(webContents)
  if (!port) {
    console.info('[main-process] view will change title to ', title)
    return
  }
  port.postMessage({
    jsonrpc: '2.0',
    method: 'Viewlet.executeViewletCommand',
    params: [
      'SimpleBrowser',
      'browserViewId',
      webContents.id,
      'handleTitleUpdated',
      title,
    ],
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
  const webContents = event.sender
  const falltroughKeyBindings = [] // TODO
  const port = getPort(webContents)
  const identifier = getIdentifier(input)
  for (const fallThroughKeyBinding of falltroughKeyBindings) {
    if (fallThroughKeyBinding.key === identifier) {
      event.preventDefault()
      port.postMessage({
        jsonrpc: '2.0',
        method: fallThroughKeyBinding.command,
        params: fallThroughKeyBinding.args || [],
      })
      return
    }
  }
}

const handleDestroyed = (event) => {
  const webContents = event.sender
  Debug.debug(`[main process] browser view ${webContents.id} destroyed`)
  ElectronBrowserViewState.remove(webContents.id)
}

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

  if (ElectronBrowserViewCss.electronBrowserViewCss) {
    webContents.insertCSS(ElectronBrowserViewCss.electronBrowserViewCss)
  }
  /**
   *
   * @type {(details: Electron.HandlerDetails) => ({action: 'deny'}) | ({action: 'allow', overrideBrowserWindowOptions?: Electron.BrowserWindowConstructorOptions})} param0
   * @returns
   */
  const handleWindowOpen = ({
    url,
    disposition,
    features,
    frameName,
    referrer,
    postBody,
  }) => {
    // TODO maybe need to put this function into a closure
    if (url === 'about:blank') {
      return { action: ElectronWindowOpenActionType.Allow }
    }
    // console.log({ disposition, features, frameName, referrer, postBody })
    if (disposition === ElectronDispositionType.BackgroundTab) {
      // TODO open background tab
      const port = getPort(webContents)
      if (!port) {
        console.warn('[main process] handlwWindowOpen - no port found')
        return {
          action: ElectronWindowOpenActionType.Deny,
        }
      }
      port.postMessage({
        jsonrpc: '2.0',
        method: 'SimpleBrowser.openBackgroundTab',
        params: [url],
      })
      return {
        action: ElectronWindowOpenActionType.Deny,
      }
    }
    console.info(`[main-process] blocked popup for ${url}`)
    return {
      action: ElectronWindowOpenActionType.Deny,
    }
  }
  webContents.on('context-menu', handleContextMenu)
  webContents.on('will-navigate', handleWillNavigate)
  webContents.on('did-navigate', handleDidNavigate)
  webContents.on('page-title-updated', handlePageTitleUpdated)
  webContents.on('destroyed', handleDestroyed)
  webContents.on('before-input-event', handleBeforeInput)
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
