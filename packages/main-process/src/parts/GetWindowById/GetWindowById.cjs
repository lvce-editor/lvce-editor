const Assert = require('../Assert/Assert.cjs')
const Electron = require('electron')

exports.getWindowById = (windowId) => {
  Assert.number(windowId)
  return Electron.BrowserWindow.fromId(windowId)
}
