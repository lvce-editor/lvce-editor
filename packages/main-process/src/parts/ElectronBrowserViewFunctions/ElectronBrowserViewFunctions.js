const { BrowserWindow } = require('electron')

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

exports.setIframeSrc = async (view, iframeSrc) => {
  await view.webContents.loadURL(iframeSrc)
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
