import * as Electron from 'electron'
import * as Assert from '../Assert/Assert.js'

export const getWindowById = (windowId) => {
  Assert.number(windowId)
  return Electron.BrowserWindow.fromId(windowId)
}
