const { BrowserView, BrowserWindow, webContents } = require('electron')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
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

exports.createBrowserView = async (
  top,
  left,
  width,
  height,
  falltroughKeyBindings
) => {
  console.log('[main process] create browser view')
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return ElectronBrowserViewState.getAnyKey()
  }
  // TODO support multiple browser views in the future
  if (browserWindow.getBrowserViews().length > 0) {
    return ElectronBrowserViewState.getAnyKey()
  }
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  const id = view.webContents.id
  ElectronBrowserViewState.add(id, browserWindow, view)

  const getPort = () => {
    const state = AppWindowStates.findById(browserWindow.webContents.id)
    const { port } = state
    return port
  }

  /**
   * @param {Electron.Event} event
   * @param {string} url
   */
  const handleWillNavigate = (event, url) => {
    const port = getPort()
    port.postMessage({
      jsonrpc: '2.0',
      method: 'SimpleBrowser.handleWillNavigate',
      params: [url],
    })
  }
  const handlePageTitleUpdated = (event, title) => {
    const port = getPort()
    port.postMessage({
      jsonrpc: '2.0',
      method: 'SimpleBrowser.handleTitleUpdated',
      params: [title],
    })
  }
  const handleDestroyed = () => {
    ElectronBrowserViewState.remove(id)
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
    if (url === 'about:blank') {
      return { action: ElectronWindowOpenActionType.Allow }
    }
    // console.log({ disposition, features, frameName, referrer, postBody })
    if (disposition === ElectronDispositionType.BackgroundTab) {
      // TODO open background tab
      const port = getPort()
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
  view.webContents.on('will-navigate', handleWillNavigate)
  view.webContents.on('did-navigate', handleWillNavigate)
  view.webContents.on('page-title-updated', handlePageTitleUpdated)
  view.webContents.on('destroyed', handleDestroyed)
  view.webContents.setWindowOpenHandler(handleWindowOpen)
  // browserWindow.addBrowserView(view)
  view.setBounds({ x: left, y: top, width, height })

  /**
   * @param {Electron.Event} event
   * @param {Electron.Input} input
   */
  const handleBeforeInput = (event, input) => {
    if (input.type !== 'keyDown') {
      return
    }
    const port = getPort()
    const identifier = getIdentifier(input)
    for (const fallThroughKeyBinding of falltroughKeyBindings) {
      if (fallThroughKeyBinding.key === identifier) {
        event.preventDefault()
        console.log({ identifier, fallThroughKeyBinding })
        console.log('post message to port')
        port.postMessage({
          jsonrpc: '2.0',
          method: fallThroughKeyBinding.command,
          params: fallThroughKeyBinding.args || [],
        })
        return
      }
    }
  }
  view.webContents.on('before-input-event', handleBeforeInput)
  return view.webContents.id
}

exports.disposeBrowserView = (id) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const view = views[0]
  if (!view) {
    return
  }
  browserWindow.removeBrowserView(view)
}
