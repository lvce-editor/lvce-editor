const { VError } = require('../VError/VError.cjs')
const Path = require('../Path/Path.cjs')
const Root = require('../Root/Root.cjs')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.cjs')
const Assert = require('../Assert/Assert.cjs')
const LoadErrorCode = require('../LoadErrorCode/LoadErrorCode.js')
const Debug = require('../Debug/Debug.cjs')

// TODO create output channel for browser view debug logs

exports.wrapBrowserViewCommand = (fn) => {
  const wrappedCommand = (id, ...args) => {
    const state = ElectronBrowserViewState.get(id)
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
exports.resizeBrowserView = (view, x, y, width, height) => {
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
exports.setIframeSrc = async (view, iframeSrc) => {
  const { webContents } = view
  try {
    await webContents.loadURL(iframeSrc)
  } catch (error) {
    if (error && error.code === LoadErrorCode.ERR_ABORTED) {
      Debug.debug(`[main process] navigation to ${iframeSrc} aborted`)
      return
    }
    if (error && error.code === LoadErrorCode.ERR_FAILED && ElectronBrowserViewState.isCanceled(webContents.id)) {
      Debug.debug(`[main process] navigation to ${iframeSrc} canceled`)
      ElectronBrowserViewState.removeCanceled(webContents.id)
      return
    }
    try {
      await setIframeSrcFallback(view, error)
    } catch (error) {
      // @ts-ignore
      throw new VError(error, `Failed to set iframe src`)
    }
    ElectronBrowserViewState.removeCanceled(webContents.id)
  }
}
/**
 *
 * @param {Electron.BrowserView} view
 */
exports.focus = (view) => {
  const { webContents } = view
  webContents.focus()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
exports.openDevtools = (view) => {
  const { webContents } = view
  // TODO return promise that resolves once devtools are actually open
  webContents.openDevTools()
}
/**
 *
 * @param {Electron.BrowserView} view
 */
exports.reload = (view) => {
  const { webContents } = view
  webContents.reload()
}
/**
 *
 * @param {Electron.BrowserView} view
 */
exports.forward = (view) => {
  const { webContents } = view
  webContents.goForward()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
exports.backward = (view) => {
  // TODO return promise that resolves once devtools are actually open
  const { webContents } = view
  webContents.goBack()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
exports.cancelNavigation = (view) => {
  const { webContents } = view
  ElectronBrowserViewState.setCanceled(webContents.id)
  Debug.debug(`[main process] canceled navigation to ${webContents.getURL()}`)
  webContents.stop()
  if (webContents.canGoBack()) {
    webContents.goBack()
  }
}

exports.show = (id) => {
  // console.log('[main-process] show browser view', id)
  const state = ElectronBrowserViewState.get(id)
  if (!state) {
    Debug.debug('[main-process] failed to show browser view', id)
    return
  }
  const { view, browserWindow } = state
  browserWindow.addBrowserView(view)
  // workaround for electron bug, view not being shown
  view.setBounds(view.getBounds())
}

exports.hide = (id) => {
  const state = ElectronBrowserViewState.get(id)
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
exports.inspectElement = (view, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { webContents } = view
  webContents.inspectElement(x, y)
}

/**
 *
 * @param {Electron.BrowserView} view
 * @param {number} x
 * @param {number} y
 */
exports.copyImageAt = (view, x, y) => {
  Assert.number(x)
  Assert.number(y)
  const { webContents } = view
  webContents.copyImageAt(x, y)
}

exports.setFallThroughKeyBindings = (fallthroughKeyBindings) => {
  ElectronBrowserViewState.setFallthroughKeyBindings(fallthroughKeyBindings)
}

// TODO maybe move some of these to webContentFunctions

/**
 * @param {Electron.BrowserView} view
 */
exports.getStats = (view) => {
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
