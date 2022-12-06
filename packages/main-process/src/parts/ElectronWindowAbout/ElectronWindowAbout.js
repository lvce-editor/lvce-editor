const { dialog } = require('electron')
const Session = require('../ElectronSession/ElectronSession.js')
const Platform = require('../Platform/Platform.js')
const Logger = require('../Logger/Logger.js')
const { BrowserWindow } = require('electron')

/**
 * Show an about window, similar to https://github.com/rhysd/electron-about-window
 */
exports.open = async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  await dialog.showMessageBox(focusedWindow, { message: 'abc' })
}
