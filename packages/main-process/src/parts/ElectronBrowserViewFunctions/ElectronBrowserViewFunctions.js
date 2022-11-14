const { VError } = require('verror')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')
const Assert = require('../Assert/Assert.js')
const LoadErrorCode = require('../LoadErrorCode/LoadErrorCode.js')

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
 * @param {number} top
 * @param {number} left
 * @param {number} width
 * @param {number} height
 */
exports.resizeBrowserView = (view, top, left, width, height) => {
  view.setBounds({ x: left, y: top, width, height })
}

const setIframeSrcFallback = async (view, error) => {
  await view.webContents.loadFile(
    Path.join(
      Root.root,
      'packages',
      'main-process',
      'pages',
      'error',
      'error.html'
    ),
    {
      query: {
        code: error.code,
      },
    }
  )
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
      console.info(`[main process] navigation to ${iframeSrc} aborted`)
    }
    if (
      error &&
      error.code === LoadErrorCode.ERR_FAILED &&
      ElectronBrowserViewState.isCanceled(webContents.id)
    ) {
      console.info(`[main process] navigation to ${iframeSrc} canceled`)
      ElectronBrowserViewState.removeCanceled(webContents.id)
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
  console.info(`[main process] canceled navigation to ${webContents.getURL()}`)
  webContents.stop()
  if (webContents.canGoBack()) {
    webContents.goBack()
  }
}

exports.show = (id) => {
  // console.log('[main-process] show browser view', id)
  const state = ElectronBrowserViewState.get(id)
  if (!state) {
    console.log('[main-process] failed to show browser view', id)
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
    console.log('[main-process] failed to hide browser view', id)
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
