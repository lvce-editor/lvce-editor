const { BrowserView, BrowserWindow } = require('electron')
const ElectronSessionForBrowserView = require('../ElectronSessionForBrowserView/ElectronSessionForBrowserView.js')
const ElectronSession = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Root = require('../Root/Root.js')
const Path = require('../Path/Path.js')
const PendingPorts = require('../PendingPorts/PendingPorts.js')
const { VError } = require('verror')

exports.createBrowserView = async (url, top, left, width, height) => {
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
