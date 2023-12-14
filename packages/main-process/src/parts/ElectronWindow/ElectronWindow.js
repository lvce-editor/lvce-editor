import * as Electron from 'electron'
import * as GetWindowById from '../GetWindowById/GetWindowById.js'
import * as Logger from '../Logger/Logger.js'

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
