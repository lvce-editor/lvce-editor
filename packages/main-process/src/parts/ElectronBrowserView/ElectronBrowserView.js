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
  restoreId,
  top,
  left,
  width,
  height,
  falltroughKeyBindings
) => {
  const cached = ElectronBrowserViewState.get(restoreId)
  if (cached) {
    return restoreId
  }
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return ElectronBrowserViewState.getAnyKey()
  }
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  view.setBackgroundColor('#fff')
  const { webContents } = view
  const { id } = webContents
  console.log('[main process] create browser view', id)
  ElectronBrowserViewState.add(id, browserWindow, view)
  const getPort = () => {
    const state = AppWindowStates.findById(browserWindow.webContents.id)
    if (!state) {
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
    const port = getPort()
    if (!port) {
      console.info('[main-process] view will navigate to ', url)
      return
    }
    port.postMessage({
      jsonrpc: '2.0',
      method: 'Viewlet.executeViewletCommand',
      params: ['SimpleBrowser', 'browserViewId', id, 'handleWillNavigate', url],
    })
  }
  const handlePageTitleUpdated = (event, title) => {
    const port = getPort()
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
        id,
        'handleTitleUpdated',
        title,
      ],
    })
  }
  const handleDestroyed = () => {
    console.log(`[main process] browser view ${id} destroyed`)
    ElectronBrowserViewState.remove(id)
  }

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
  webContents.on('will-navigate', handleWillNavigate)
  webContents.on('did-navigate', handleWillNavigate)
  webContents.on('page-title-updated', handlePageTitleUpdated)
  webContents.on('destroyed', handleDestroyed)
  webContents.on('before-input-event', handleBeforeInput)
  webContents.setWindowOpenHandler(handleWindowOpen)
  view.setBounds({ x: left, y: top, width, height })
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
