const Electron = require('electron')
const Path = require('../Path/Path.js')
const Root = require('../Root/Root.js')
const Platform = require('../Platform/Platform.js')
const Preferences = require('../Preferences/Preferences.js')
const Clamp = require('../Clamp/Clamp.js')

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
 *  x:number,
 *  y:number,
 *  width:number,
 *  height:number,
 *  menu?:boolean,
 *  background?:string,
 *  session?:import('electron').Session,
 *  titleBarStyle?:any,
 *  titleBarOverlay?:any,
 *  frame?:boolean
 *  zoomLevel?:number
 * }} param0
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
  titleBarStyle,
  titleBarOverlay,
  frame,
  zoomLevel = 0,
}) => {
  // const windowControlsOverlayEnabled = Platform.isWindows
  // const titleBarOptions = getTitleBarOptions(windowControlsOverlayEnabled)
  const browserWindow = new Electron.BrowserWindow({
    x,
    y,
    width,
    height,
    autoHideMenuBar: true,
    titleBarStyle,
    titleBarOverlay,
    frame,
    webPreferences: {
      enableWebSQL: false,
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      v8CacheOptions: 'bypassHeatCheck', // TODO this is what vscode uses, but it doesn't work properly in electron https://github.com/electron/electron/issues/27075
      preload: Platform.getPreloadUrl(),
      session,
      additionalArguments: ['--lvce-window-kind'],
    },
    backgroundColor: background,
    show: false,
  })
  const handleReadyToShow = () => {
    // due to electron bug, zoom level needs to be set here,
    // cannot be set when creating the browser window
    browserWindow.webContents.setZoomLevel(zoomLevel)
    browserWindow.show()
  }
  browserWindow.once('ready-to-show', handleReadyToShow)
  return browserWindow
}

/**
 *
 * @param {Electron.BrowserWindow} browserWindow
 * @param {*} getDelta
 * @param {*} getMinZoomLevel
 * @param {*} getMaxZoomLevel
 * @returns
 */
const setZoom = async (
  browserWindow,
  getDelta,
  getMinZoomLevel,
  getMaxZoomLevel
) => {
  const delta = getDelta()
  const minZoomLevel = getMinZoomLevel()
  const maxZoomLevel = getMaxZoomLevel()
  const currentZoomLevel = browserWindow.webContents.getZoomLevel()
  const newZoomFactor = Clamp.clamp(
    currentZoomLevel + delta,
    minZoomLevel,
    maxZoomLevel
  )
  if (newZoomFactor === currentZoomLevel) {
    return
  }
  browserWindow.webContents.setZoomLevel(newZoomFactor)
  await Preferences.update('window.zoomLevel', newZoomFactor)
}

const getMinZoomLevel = () => {
  return -3
}

const getMaxZoomLevel = () => {
  return 3
}

const getZoomInDelta = () => {
  return 0.2
}

const getZoomOutDelta = () => {
  return -0.2
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.zoomIn = async (browserWindow) => {
  await setZoom(browserWindow, getZoomInDelta, getMinZoomLevel, getMaxZoomLevel)
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.zoomOut = async (browserWindow) => {
  await setZoom(
    browserWindow,
    getZoomOutDelta,
    getMinZoomLevel,
    getMaxZoomLevel
  )
}
