const { BrowserWindow } = require('electron')
const { VError } = require('verror')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')

exports.wrapBrowserViewCommand = (fn) => {
  const wrappedCommand = (...args) => {
    const browserWindow = BrowserWindow.getFocusedWindow()
    if (!browserWindow) {
      return
    }
    const views = browserWindow.getBrowserViews()
    const view = views[0]
    if (!view) {
      return
    }
    return fn(view, ...args)
  }
  return wrappedCommand
}

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
 * @param {Electron.BrowserView} view
 * @param {string} iframeSrc
 */
exports.setIframeSrc = async (view, iframeSrc) => {
  try {
    await view.webContents.loadURL(iframeSrc)
  } catch (error) {
    try {
      await setIframeSrcFallback(view, error)
    } catch (error) {
      // @ts-ignore
      throw new VError(error, `Failed to set iframe src`)
    }
  }
}
/**
 *
 * @param {Electron.BrowserView} view
 */
exports.focus = (view) => {
  view.webContents.focus()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
exports.openDevtools = (view) => {
  // TODO return promise that resolves once devtools are actually open
  view.webContents.openDevTools()
}
/**
 *
 * @param {Electron.BrowserView} view
 */
exports.reload = (view) => {
  // TODO return promise that resolves once devtools are actually open
  view.webContents.reload()
}
/**
 *
 * @param {Electron.BrowserView} view
 */
exports.forward = (view) => {
  // TODO return promise that resolves once devtools are actually open
  view.webContents.goForward()
}

/**
 *
 * @param {Electron.BrowserView} view
 */
exports.backward = (view) => {
  // TODO return promise that resolves once devtools are actually open
  view.webContents.goBack()
}
