const { BrowserView, BrowserWindow } = require('electron')

exports.createBrowserView = async (url, top, left, width, height) => {
  console.log('todo create browser view')
  const browserWindow = BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  const view = new BrowserView()
  browserWindow.setBrowserView(view)
  view.setBounds({ x: left, y: top, width, height })
  await view.webContents.loadURL(url)
}

exports.disposeBrowserView = (id) => {
  throw new Error('not implemented')
}
