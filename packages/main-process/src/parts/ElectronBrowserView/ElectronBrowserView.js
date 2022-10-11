const { BrowserView, BrowserWindow } = require('electron')

exports.createBrowserView = async (url, top, left, width, height) => {
  console.log('todo create browser view')
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const view = new BrowserView()
  browserWindow.addBrowserView(view)
  view.setBounds({ x: left, y: top, width, height })
  view.webContents.toggleDevTools()
  await view.webContents.loadURL(url)
  // browserWindow.brow
}

exports.resizeBrowserView = (top, left, width, height) => {
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const view = browserWindow.getBrowserView()
  if (!view) {
    return
  }
  view.setBounds({ x: left, y: top, width, height })
}

exports.disposeBrowserView = (id) => {
  throw new Error('not implemented')
}
