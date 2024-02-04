import * as Electron from 'electron'
import { BrowserView, BrowserWindow } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as Debug from '../Debug/Debug.js'
import * as DisposeWebContents from '../DisposeWebContents/DisposeWebContents.js'
import * as ElectronBrowserViewAdBlock from '../ElectronBrowserViewAdBlock/ElectronBrowserViewAdBlock.js'
import * as ElectronBrowserViewState from '../ElectronBrowserViewState/ElectronBrowserViewState.js'
import * as ElectronDispositionType from '../ElectronDispositionType/ElectronDispositionType.js'
import * as ElectronInputType from '../ElectronInputType/ElectronInputType.js'
import * as ElectronSessionForBrowserView from '../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js'
import * as ElectronWebContentsEventType from '../ElectronWebContentsEventType/ElectronWebContentsEventType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as ElectronWindowOpenActionType from '../ElectronWindowOpenActionType/ElectronWindowOpenActionType.js'
import { JsonRpcEvent } from '../JsonRpc/JsonRpc.js'
import * as Logger from '../Logger/Logger.js'

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
 * @returns {any}
 */
export const getPort = (id) => {
  Logger.info('[main process] no message port found')
  return undefined
}

/**
 *
 * @param {number} restoreId
 * @returns
 */
export const createBrowserView = async (restoreId, uid) => {
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
      const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [uid, 'updateBackgroundTab', url])
      port.postMessage(message)
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
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [uid, 'handleWillNavigate', url, canGoBack, canGoForward])
    port.postMessage(message)
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
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [uid, 'handleDidNavigate', url, canGoBack, canGoForward])
    port.postMessage(message)
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
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [uid, 'handleContextMenu', params])
    port.postMessage(message)
  }

  const handlePageTitleUpdated = (event, title) => {
    const port = getPort(browserWindowId)
    if (!port) {
      Logger.info('[main-process] view will change title to ', title)
      return
    }
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [uid, 'handleTitleUpdated', title])
    port.postMessage(message)
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
        const message = JsonRpcEvent.create(fallThroughKeyBinding.command, fallThroughKeyBinding.args || [])
        port.postMessage(message)
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
      const port = getPort(webContentsId)
      if (!port) {
        Logger.warn('[main process] handlwWindowOpen - no port found')
        return {
          action: ElectronWindowOpenActionType.Deny,
        }
      }
      const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [webContentsId, 'updateBackgroundTab', url])
      port.postMessage(message)
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
    const port = getPort(webContentsId)
    if (!port) {
      Logger.info('[main-process] view will navigate to ', url)
      return
    }
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [webContentsId, 'handleWillNavigate', url, canGoBack, canGoForward])
    port.postMessage(message)
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
    const port = getPort(webContentsId)
    if (!port) {
      Logger.info('[main-process] view did navigate to ', url)
      return
    }
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [webContentsId, 'handleDidNavigate', url, canGoBack, canGoForward])
    port.postMessage(message)
  }

  /**
   *
   * @param {Electron.Event} event
   * @param {Electron.ContextMenuParams} params
   */
  const handleContextMenu = (event, params) => {
    const port = getPort(webContentsId)
    if (!port) {
      return
    }
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [webContentsId, 'handleContextMenu', params])
    port.postMessage(message)
  }

  const handlePageTitleUpdated = (event, title) => {
    const port = getPort(webContentsId)
    if (!port) {
      Logger.info('[main-process] view will change title to ', title)
      return
    }
    const message = JsonRpcEvent.create('Viewlet.executeViewletCommand', [webContentsId, 'handleTitleUpdated', title])
    port.postMessage(message)
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
    const port = getPort(webContentsId)
    const identifier = getIdentifier(input)
    for (const fallThroughKeyBinding of falltroughKeyBindings) {
      if (fallThroughKeyBinding.key === identifier) {
        event.preventDefault()
        const message = JsonRpcEvent.create(fallThroughKeyBinding.command, fallThroughKeyBinding.args || [])
        port.postMessage(message)
        return
      }
    }
  }

  const handleDestroyed = (event) => {
    Debug.debug(`[main process] browser view ${webContents.id} destroyed`)
    ElectronBrowserViewState.remove(webContents.id)
    SharedProcess.send(JsonRpcEvent.create('ElectronBrowserView.handleBrowserViewDestroyed', webContents.id))
  }

  webContents.on(ElectronWebContentsEventType.ContextMenu, handleContextMenu)
  webContents.on(ElectronWebContentsEventType.WillNavigate, handleWillNavigate)
  webContents.on(ElectronWebContentsEventType.DidNavigate, handleDidNavigate)
  webContents.on(ElectronWebContentsEventType.PageTitleUpdated, handlePageTitleUpdated)
  webContents.on(ElectronWebContentsEventType.Destroyed, handleDestroyed)
  webContents.on(ElectronWebContentsEventType.BeforeInputEvent, handleBeforeInput)
  webContents.setWindowOpenHandler(handleWindowOpen)
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
