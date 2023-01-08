const { ipcMain } = require('electron')

exports.on = (event, listener) => {
  ipcMain.on(event, listener)
}
