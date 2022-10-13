const { BrowserView, BrowserWindow } = require('electron')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const AppWindowStates = require('../AppWindowStates/AppWindowStates.js')

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
  url,
  top,
  left,
  width,
  height,
  falltroughKeyBindings
) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  // TODO support multiple browser views in the future
  if (browserWindow.getBrowserViews().length > 0) {
    return
  }
  const view = new BrowserView({
    webPreferences: {
      session: ElectronSessionForBrowserView.getSession(),
    },
  })
  view.webContents.setWindowOpenHandler(
    ElectronSessionForBrowserView.handleWindowOpen
  )
  browserWindow.addBrowserView(view)
  view.setBounds({ x: left, y: top, width, height })
  await view.webContents.loadURL(url)

  /**
   * @param {Electron.Event} event
   * @param {Electron.Input} input
   */
  const handleBeforeInput = (event, input) => {
    if (input.type !== 'keyDown') {
      return
    }
    const state = AppWindowStates.findById(browserWindow.webContents.id)
    const { port } = state
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
}

exports.resizeBrowserView = (top, left, width, height) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const view = views[0]
  if (!view) {
    return
  }
  view.setBounds({ x: left, y: top, width, height })
}

exports.setIframeSrc = async (iframeSrc) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const views = browserWindow.getBrowserViews()
  const view = views[0]
  if (!view) {
    return
  }
  await view.webContents.loadURL(iframeSrc)
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
