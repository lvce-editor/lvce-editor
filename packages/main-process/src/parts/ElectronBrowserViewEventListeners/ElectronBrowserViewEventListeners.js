const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const ElectronInputType = require('../ElectronInputType/ElectronInputType.js')
const Debug = require('../Debug/Debug.js')
const Logger = require('../Logger/Logger.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')
const ElectronDispositionType = require('../ElectronDispositionType/ElectronDispositionType.js')
const ElectronWindowOpenActionType = require('../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js')

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
const getPort = (exports.getPort = (webContents) => {
  const browserWindow = ElectronBrowserViewState.getWindow(webContents)
  const state = AppWindowStates.findById(browserWindow.webContents.id)
  if (!state) {
    Logger.info('[main process] no message port found')
    return undefined
  }
  const { port } = state
  return port
})

/**
 * @param {Electron.Event} event
 * @param {string} url
 */
exports.handleWillNavigate = (event, url) => {
  Debug.debug(`[main-process] will navigate to ${url}`)
  // console.log({ event, url })
  const webContents = event.sender
  const canGoForward = webContents.canGoForward()
  const canGoBack = webContents.canGoBack()
  const port = getPort(webContents)
  if (!port) {
    Logger.info('[main-process] view will navigate to ', url)
    return
  }
  port.postMessage({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Viewlet.executeViewletCommand',
    params: ['SimpleBrowser', 'browserViewId', webContents.id, 'handleWillNavigate', url, canGoBack, canGoForward],
  })
}
/**
 * @param {Electron.Event} event
 * @param {string} url
 */
exports.handleDidNavigate = (event, url) => {
  Debug.debug(`[main-process] did navigate to ${url}`)
  console.log(`[main-process] did navigate to ${url}`)
  const webContents = event.sender
  const canGoForward = webContents.canGoForward()
  const canGoBack = webContents.canGoBack()
  const port = getPort(webContents)
  if (!port) {
    Logger.info('[main-process] view did navigate to ', url)
    return
  }
  port.postMessage({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Viewlet.executeViewletCommand',
    params: ['SimpleBrowser', 'browserViewId', webContents.id, 'handleDidNavigate', url, canGoBack, canGoForward],
  })
}

/**
 *
 * @param {Electron.Event} event
 * @param {Electron.ContextMenuParams} params
 */
exports.handleContextMenu = (event, params) => {
  const webContents = event.sender
  const port = getPort(webContents)
  if (!port) {
    return
  }
  port.postMessage({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Viewlet.executeViewletCommand',
    params: ['SimpleBrowser', 'browserViewId', webContents.id, 'handleContextMenu', params],
  })
}

exports.handlePageTitleUpdated = (event, title) => {
  const webContents = event.sender
  const port = getPort(webContents)
  if (!port) {
    Logger.info('[main-process] view will change title to ', title)
    return
  }
  port.postMessage({
    jsonrpc: JsonRpcVersion.Two,
    method: 'Viewlet.executeViewletCommand',
    params: ['SimpleBrowser', 'browserViewId', webContents.id, 'handleTitleUpdated', title],
  })
}

/**
 * @param {Electron.Event} event
 * @param {Electron.Input} input
 */
exports.handleBeforeInput = (event, input) => {
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
        jsonrpc: JsonRpcVersion.Two,
        method: fallThroughKeyBinding.command,
        params: fallThroughKeyBinding.args || [],
      })
      return
    }
  }
}

exports.handleDestroyed = (event) => {
  const webContents = event.sender
  Debug.debug(`[main process] browser view ${webContents.id} destroyed`)
  ElectronBrowserViewState.remove(webContents.id)
}

/**
 *
 * @type {(webContents:Electron.WebContents, details: Electron.HandlerDetails) => ({action: 'deny'}) | ({action: 'allow', overrideBrowserWindowOptions?: Electron.BrowserWindowConstructorOptions})} param1
 * @returns
 */
exports.handleWindowOpen = (webContents, { url, disposition, features, frameName, referrer, postBody }) => {
  // TODO maybe need to put this function into a closure
  if (url === 'about:blank') {
    return { action: ElectronWindowOpenActionType.Allow }
  }
  // console.log({ disposition, features, frameName, referrer, postBody })
  if (disposition === ElectronDispositionType.BackgroundTab) {
    // TODO open background tab
    const port = getPort(webContents)
    if (!port) {
      Logger.warn('[main process] handlwWindowOpen - no port found')
      return {
        action: ElectronWindowOpenActionType.Deny,
      }
    }
    port.postMessage({
      jsonrpc: JsonRpcVersion.Two,
      method: 'SimpleBrowser.openBackgroundTab',
      params: [url],
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
