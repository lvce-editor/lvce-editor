import * as Electron from 'electron'
import * as GetWindowById from '../GetWindowById/GetWindowById.js'
import * as Logger from '../Logger/Logger.js'

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
 * @returns {any}
 */
export const getFocusedWindowId = () => {
  const browserWindow = Electron.BrowserWindow.getFocusedWindow()
  if (!browserWindow) {
    return -1
  }
  return browserWindow.id
}

export const getZoom = (windowId) => {
  if (!windowId) {
    return 1
  }
  const browserWindow = Electron.BrowserWindow.fromId(windowId)
  if (!browserWindow) {
    return 1
  }
  return browserWindow.webContents.getZoomLevel()
}
