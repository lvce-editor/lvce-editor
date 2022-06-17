const Electron = require('../Electron/Electron.js')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')

exports.wrapWindowCommand = (fn) => () => {
  const browserWindow = Electron.BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return
  }
  fn(browserWindow)
}

/**
 * @param {Electron. BrowserWindow} browserWindow
 */
exports.toggleDevtools = (browserWindow) => {
  browserWindow.webContents.toggleDevTools()
}

/**
 * @param {Electron. BrowserWindow} browserWindow
 */
exports.minimize = (browserWindow) => {
  browserWindow.minimize()
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.maximize = (browserWindow) => {
  browserWindow.maximize()
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.unmaximize = (browserWindow) => {
  browserWindow.unmaximize()
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.close = (browserWindow) => {
  browserWindow.close()
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.reload = (browserWindow) => {
  browserWindow.reload()
}

exports.getFocusedWindow = () => {
  return Electron.BrowserWindow.getFocusedWindow() || undefined
}

/**
 *
 * @param {{
 * x:number, y:number, width:number, height:number, menu?:boolean, background?:string, session?:import('electron').Session}} param0
 */
exports.create = ({
  x,
  y,
  width,
  height,
  // url,
  menu = false,
  background = '#ffffff',
  session = undefined,
}) => {
  const browserWindow = new Electron.BrowserWindow({
    x,
    y,
    width,
    height,
    autoHideMenuBar: true,
    webPreferences: {
      enableWebSQL: false,
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      v8CacheOptions: 'bypassHeatCheck', // TODO this is what vscode uses, but it doesn't work properly in electron https://github.com/electron/electron/issues/27075
      preload: Path.join(
        Root.root,
        'packages',
        'main-process',
        'src',
        'preload.js'
      ),
      session,
    },
    backgroundColor: background,
    show: false,
  })
  const handleReadyToShow = () => {
    browserWindow.show()
  }
  browserWindow.once('ready-to-show', handleReadyToShow)
  return browserWindow
}
