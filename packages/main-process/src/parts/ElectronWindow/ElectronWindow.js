import * as Electron from 'electron'
import * as Clamp from '../Clamp/Clamp.js'
import * as GetIcon from '../GetIcon/GetIcon.js'
import * as GetWindowById from '../GetWindowById/GetWindowById.js'
import * as Logger from '../Logger/Logger.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'

export const wrapWindowCommand =
  (fn) =>
  (id, ...args) => {
    const browserWindow = GetWindowById.getWindowById(id)
    if (!browserWindow) {
      Logger.info(`[main-process] browser window not found ${id}`)
      return
    }
    fn(browserWindow, ...args)
  }

export const executeWindowFunction = (browserWindowId, key) => {
  const browserWindow = GetWindowById.getWindowById(browserWindowId)
  if (!browserWindow) {
    Logger.info(`[main-process] browser window not found ${browserWindow}`)
    return
  }
  browserWindow[key]()
}

export const executeWebContentsFunction = (browserWindowId, key) => {
  const browserWindow = GetWindowById.getWindowById(browserWindowId)
  if (!browserWindow) {
    Logger.info(`[main-process] browser window not found ${browserWindow}`)
    return
  }
  browserWindow.webContents[key]()
}

export const getFocusedWindow = () => {
  return Electron.BrowserWindow.getFocusedWindow() || undefined
}

export const findById = (windowId) => {
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
export const create = ({
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
export const zoomIn = (browserWindow) => {
  return setZoomDelta(browserWindow, getZoomInDelta, getMinZoomLevel, getMaxZoomLevel)
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
export const zoomOut = (browserWindow) => {
  return setZoomDelta(browserWindow, getZoomOutDelta, getMinZoomLevel, getMaxZoomLevel)
}

/**
 * @param {Electron.BrowserWindow} browserWindow
 */
export const zoomReset = (browserWindow) => {
  return setZoom(browserWindow, getDefaultZoomLevel(), getMinZoomLevel(), getMaxZoomLevel())
}
