import * as Electron from 'electron'
import * as GetIcon from '../GetIcon/GetIcon.js'
import * as GetWindowById from '../GetWindowById/GetWindowById.js'
import * as Logger from '../Logger/Logger.js'
import * as Performance from '../Performance/Performance.js'
import * as PerformanceMarkerType from '../PerformanceMarkerType/PerformanceMarkerType.js'
import * as Platform from '../Platform/Platform.js'

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

export const executeWebContentsFunction = (browserWindowId, key, ...args) => {
  const browserWindow = GetWindowById.getWindowById(browserWindowId)
  if (!browserWindow) {
    Logger.info(`[main-process] browser window not found ${browserWindow}`)
    return
  }
  browserWindow.webContents[key](...args)
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
