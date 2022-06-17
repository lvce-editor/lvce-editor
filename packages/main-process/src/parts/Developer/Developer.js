const { MessageChannelMain, ipcMain } = require('electron')
const { join } = require('path')
const { BrowserWindow } = require('../Electron/Electron.js')
const Performance = require('../Performance/Performance.js')

exports.getPerformanceEntries = () => {
  const entries = Performance.getEntries()
  const timeOrigin = Performance.timeOrigin
  return {
    entries,
    timeOrigin,
  }
}

exports.crashMainProcess = () => {
  throw new Error('oops')
}
