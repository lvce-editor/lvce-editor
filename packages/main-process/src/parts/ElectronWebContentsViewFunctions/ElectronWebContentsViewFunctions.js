import { BrowserWindow } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as Debug from '../Debug/Debug.js'
import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'
import * as LoadErrorCode from '../LoadErrorCode/LoadErrorCode.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import { VError } from '../VError/VError.js'
import * as IsWebContentsView from '../IsWebContentsView/IsWebContentsView.js'

// TODO create output channel for browser view debug logs

export const wrapBrowserViewCommand = (fn) => {
  const wrappedCommand = (id, ...args) => {
    const state = ElectronWebContentsViewState.get(id)
    if (!state) {
      console.log(`[main process] no browser view with id ${id}`)
      return
    }
    const { view } = state
    return fn(view, ...args)
  }
  return wrappedCommand
}

/**
 *
 * @param {Electron.BrowserView} view
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
export const resizeBrowserView = (view, x, y, width, height) => {
  Assert.object(view)
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  view.setBounds({ x, y, width, height })
}

const setIframeSrcFallback = async (view, error) => {
  await view.webContents.loadFile(Path.join(Root.root, 'packages', 'main-process', 'pages', 'error', 'error.html'), {
    query: {
      code: error.code,
    },
  })
}

/**
 *
 * @param {Electron.WebContents} webContents
 */
// @ts-ignore
const getTitle = (webContents) => {
  const title = webContents.getTitle()
  if (title) {
    return title
  }
  return webContents.getURL()
}

/**
 *
 * @param {Electron.BrowserView} view
 * @param {string} iframeSrc
 */
export const setIframeSrc = async (view, iframeSrc) => {
  const { webContents } = view
  try {
    await webContents.loadURL(iframeSrc)
  } catch (error) {
    // @ts-ignore
    if (error && error.code === LoadErrorCode.ERR_ABORTED) {
      Debug.debug(`[main process] navigation to ${iframeSrc} aborted`)
      return
    }
    // @ts-ignore
    if (error && error.code === LoadErrorCode.ERR_FAILED && ElectronWebContentsViewState.isCanceled(webContents.id)) {
      Debug.debug(`[main process] navigation to ${iframeSrc} canceled`)
      ElectronWebContentsViewState.removeCanceled(webContents.id)
      return
    }
    try {
      await setIframeSrcFallback(view, error)
    } catch (error) {
      // @ts-ignore
      throw new VError(error, `Failed to set iframe src`)
    }
    ElectronWebContentsViewState.removeCanceled(webContents.id)
  }
}
/**
 *
 * @param {Electron.BrowserView} view
 */
export const focus = (view) => {
  const { webContents } = view
  webContents.focus()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
export const openDevtools = (view) => {
  const { webContents } = view
  // TODO return promise that resolves once devtools are actually open
  webContents.openDevTools()
}
/**
 *
 * @param {Electron.BrowserView} view
 */
export const reload = (view) => {
  const { webContents } = view
  webContents.reload()
}
/**
 *
 * @param {Electron.BrowserView} view
 */
export const forward = (view) => {
  const { webContents } = view
  webContents.goForward()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
export const backward = (view) => {
  // TODO return promise that resolves once devtools are actually open
  const { webContents } = view
  webContents.goBack()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
export const cancelNavigation = (view) => {
  const { webContents } = view
  ElectronWebContentsViewState.setCanceled(webContents.id)
  Debug.debug(`[main process] canceled navigation to ${webContents.getURL()}`)
  webContents.stop()
  if (webContents.canGoBack()) {
    webContents.goBack()
  }
}

export const show = (id) => {
  // console.log('[main-process] show browser view', id)
  const state = ElectronWebContentsViewState.get(id)
  if (!state) {
    Debug.debug('[main-process] failed to show browser view', id)
    return
  }
  const { view, browserWindow } = state
  console.log('name', view.constructor.name)
  if (IsWebContentsView.isWebContentsView(view)) {
    browserWindow.contentView.addChildView(view)
    view.setBounds({ x: 0, y: 0, width: 400, height: 400 })
    view.setBackgroundColor('red')
    console.log('shwoing')
  } else {
    browserWindow.addBrowserView(view)
    // workaround for electron bug, view not being shown
    view.setBounds(view.getBounds())
  }
}

export const addToWindow = (browserWindowId, browserViewId) => {
  const state = ElectronWebContentsViewState.get(browserViewId)
  const { view } = state
  const browserWindow = BrowserWindow.fromId(browserWindowId)
  if (!browserWindow) {
    return
  }
  browserWindow.addBrowserView(view)
  // workaround for electron bug, view not being shown
  view.setBounds(view.getBounds())
}

export const hide = (id) => {
  const state = ElectronWebContentsViewState.get(id)
  if (!state) {
    Debug.debug('[main-process] failed to hide browser view', id)
    return
  }
  const { view, browserWindow } = state
  browserWindow.removeBrowserView(view)
}

/**
 *
 * @param {Electron.BrowserView} view
 * @param {number} x
 * @param {number} y
 */
export const inspectElement = (view, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { webContents } = view
  webContents.inspectElement(x, y)
}

/**
 *
 * @param {Electron.BrowserView} view
 * @param {string} backgroundColor
 */
export const setBackgroundColor = (view, backgroundColor) => {
  view.setBackgroundColor(backgroundColor)
}

/**
 *
 * @param {Electron.BrowserView} view
 * @param {number} x
 * @param {number} y
 */
export const copyImageAt = (view, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { webContents } = view
  webContents.copyImageAt(x, y)
}

export const setFallThroughKeyBindings = (fallthroughKeyBindings) => {
  ElectronWebContentsViewState.setFallthroughKeyBindings(fallthroughKeyBindings)
}

// TODO maybe move some of these to webContentFunctions

/**
 * @param {Electron.BrowserView} view
 */
export const getStats = (view) => {
  const { webContents } = view
  const canGoBack = webContents.canGoBack()
  const canGoForward = webContents.canGoForward()
  const url = webContents.getURL()
  const title = webContents.getTitle()
  return {
    canGoBack,
    canGoForward,
    url,
    title,
  }
}
