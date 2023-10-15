const Electron = require('electron')
const Clamp = require('../Clamp/Clamp.cjs')
const GetIcon = require('../GetIcon/GetIcon.cjs')
const GetWindowById = require('../GetWindowById/GetWindowById.cjs')
const Logger = require('../Logger/Logger.cjs')
const Platform = require('../Platform/Platform.cjs')
const Preferences = require('../Preferences/Preferences.cjs')
const Performance = require('../Performance/Performance.cjs')
const PerformanceMarkerType = require('../PerformanceMarkerType/PerformanceMarkerType.cjs')

exports.wrapWindowCommand =
  (fn) =>
  (id, ...args) => {
    const browserWindow = GetWindowById.getWindowById(id)
    if (!browserWindow) {
      Logger.info(`[main-process] browser window not found ${id}`)
      return
    }
    fn(browserWindow, ...args)
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

exports.findById = (windowId) => {
  return GetWindowById.getWindowById(windowId)
}

/**
 *
 * @returns {globalThis.Electron.BrowserWindowConstructorOptions}
 */
const getBrowserWindowOptions = ({ x, y, width, height, titleBarStyle, titleBarOverlay, frame, session, background }) => {
  // const windowControlsOverlayEnabled = Platform.isWindows
  // const titleBarOptions = getTitleBarOptions(windowControlsOverlayEnabled)
  const icon = GetIcon.getIcon()
  return {
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
    icon,
  }
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
  const options = getBrowserWindowOptions({
    x,
    y,
    width,
    height,
    background,
    session,
    titleBarStyle,
    titleBarOverlay,
    frame,
  })
  Performance.mark(PerformanceMarkerType.WillCreateCodeWindow)
  const browserWindow = new Electron.BrowserWindow(options)
  Performance.mark(PerformanceMarkerType.DidCreateCodeWindow)
  const handleReadyToShow = () => {
    // due to electron bug, zoom level needs to be set here,
    // cannot be set when creating the browser window
    browserWindow.webContents.setZoomLevel(zoomLevel)
    browserWindow.show()
  }
  browserWindow.once('ready-to-show', handleReadyToShow)
  return browserWindow
}

const setZoom = async (browserWindow, zoomFactor, minZoomLevel, maxZoomLevel) => {
  const newZoomFactor = Clamp.clamp(zoomFactor, minZoomLevel, maxZoomLevel)
  browserWindow.webContents.setZoomLevel(newZoomFactor)
  await Preferences.update('window.zoomLevel', newZoomFactor)
}

/**
 *
 * @param {Electron.BrowserWindow} browserWindow
 * @param {*} getDelta
 * @param {*} getMinZoomLevel
 * @param {*} getMaxZoomLevel
 * @returns
 */
const setZoomDelta = (browserWindow, getDelta, getMinZoomLevel, getMaxZoomLevel) => {
  const delta = getDelta()
  const minZoomLevel = getMinZoomLevel()
  const maxZoomLevel = getMaxZoomLevel()
  const currentZoomLevel = browserWindow.webContents.getZoomLevel()
  return setZoom(browserWindow, currentZoomLevel + delta, minZoomLevel, maxZoomLevel)
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

const getDefaultZoomLevel = () => {
  return 0
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.zoomIn = (browserWindow) => {
  return setZoomDelta(browserWindow, getZoomInDelta, getMinZoomLevel, getMaxZoomLevel)
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.zoomOut = (browserWindow) => {
  return setZoomDelta(browserWindow, getZoomOutDelta, getMinZoomLevel, getMaxZoomLevel)
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.zoomReset = (browserWindow) => {
  return setZoom(browserWindow, getDefaultZoomLevel(), getMinZoomLevel(), getMaxZoomLevel())
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
exports.focus = (browserWindow) => {
  browserWindow.webContents.focus()
}
