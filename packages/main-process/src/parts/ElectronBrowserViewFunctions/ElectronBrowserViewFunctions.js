const { VError } = require('verror')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')
const ElectronBrowserViewState = require('../ElectronBrowserViewState/ElectronBrowserViewState.js')

exports.wrapBrowserViewCommand = (fn) => {
  const wrappedCommand = (id, ...args) => {
    const { view } = ElectronBrowserViewState.get(id)
    if (!view) {
      console.log(`[main process] no view with id ${id}`)
      return
    }
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
 * @param {Electron.BrowserView} view
 * @param {string} iframeSrc
 */
exports.setIframeSrc = async (view, iframeSrc) => {
  try {
    await view.webContents.loadURL(iframeSrc)
    // TODO maybe have a separate function for getting title
    const newTitle = view.webContents.getTitle()
    return newTitle
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

exports.show = (id) => {
  console.log('show browser view', id)
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
