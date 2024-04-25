import * as Electron from 'electron'
import * as Assert from '../Assert/Assert.js'

export const getWindowId = (webContentsId) => {
  Assert.number(webContentsId)
  const webContents = Electron.webContents.fromId(webContentsId)
  if (!webContents) {
    return -1
  }
  const browserWindow = Electron.BrowserWindow.fromWebContents(webContents)
  if (!browserWindow) {
    return -1
  }
  return browserWindow.id
}
