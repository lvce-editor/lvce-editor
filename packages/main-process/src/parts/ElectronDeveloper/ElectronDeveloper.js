const { MessageChannelMain, ipcMain } = require('electron')
const Performance = require('../Performance/Performance.js')

exports.getPerformanceEntries = () => {
  const entries = Performance.getEntries()
  const { timeOrigin } = Performance
  return {
    entries,
    timeOrigin,
  }
}

exports.crashMainProcess = () => {
  throw new Error('oops')
}
