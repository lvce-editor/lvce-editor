import { BrowserWindow } from 'electron'
import * as Assert from '../Assert/Assert.js'
import * as Debug from '../Debug/Debug.js'
import * as ElectronWebContentsViewState from '../ElectronWebContentsViewState/ElectronWebContentsViewState.js'
import { VError } from '../VError/VError.js'
import * as WebContentsViewErrorPath from '../WebContentsViewErrorPath/WebContentsViewErrorPath.js'

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
  view.setBounds({
    x,
    y,
    width,
    height,
  })
}

export const setIframeSrcFallback = async (view, code, message) => {
  await view.webContents.loadFile(WebContentsViewErrorPath.webContentsViewErrorPath, {
    query: {
      code,
      message,
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
  try {
    Assert.object(view)
    Assert.string(iframeSrc)
    const { webContents } = view
    await webContents.loadURL(iframeSrc)
  } catch (error) {
    const betterError = new VError(error, `Failed to set iframe src`)
    // @ts-ignore
    betterError.dontPrint = true
    throw betterError
  }
  // } catch (error) {
  //   console.log({ error })
  //   // TODO send error back to embeds worker,
  //   // embeds worker decides how to handle error
  //   // @ts-ignore
  //   if (error && error.code === LoadErrorCode.ERR_ABORTED) {
  //     Debug.debug(`[main process] navigation to ${iframeSrc} aborted`)
  //     return
  //   }
  //   // @ts-ignore
  //   if (error && error.code === LoadErrorCode.ERR_FAILED && ElectronWebContentsViewState.isCanceled(webContents.id)) {
  //     Debug.debug(`[main process] navigation to ${iframeSrc} canceled`)
  //     ElectronWebContentsViewState.removeCanceled(webContents.id)
  //     return
  //   }
  //   try {
  //     await setIframeSrcFallback(view, error)
  //   } catch (error) {
  //     throw new VError(error, `Failed to set iframe src`)
  //   }
  //   ElectronWebContentsViewState.removeCanceled(webContents.id)
  // }
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
  browserWindow.addBrowserView(view)
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
