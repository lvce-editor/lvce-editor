const Electron = require('electron')
const Assert = require('../Assert/Assert.cjs')

exports.getWindowById = (windowId) => {
  Assert.number(windowId)
  return Electron.BrowserWindow.fromId(windowId)
}
