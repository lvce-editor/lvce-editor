const Assert = require('../Assert/Assert.js')
const Electron = require('electron')
const ElectronMessageBoxType = require('../ElectronMessageBoxType/ElectronMessageBoxType.js')
const Logger = require('../Logger/Logger.js')
const Platform = require('../Platform/Platform.js')
const Window = require('../ElectronWindow/ElectronWindow.js')

exports.showOpenDialog = async (title, properties) => {
  Assert.string(title)
  Assert.array(properties)
  const focusedWindow = Window.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  const result = await Electron.dialog.showOpenDialog(focusedWindow, {
    properties,
    title,
  })
  if (result.canceled || result.filePaths.length !== 1) {
    return
  }
  // TODO maybe return whole result (including canceled or not)
  return result.filePaths
}

/**
 *
 * @param {any} message
 * @param {string[]} buttons
 * @param {string} type
 * @returns
 */
exports.showMessageBox = async (message, buttons, type = ElectronMessageBoxType.Error, detail) => {
  Assert.string(message)
  Assert.array(buttons)
  const focusedWindow = Window.getFocusedWindow()
  if (!focusedWindow) {
    Logger.info(`[main-process] cannot show dialog message because there is no focused window`)
    return
  }
  if (message.message) {
    message = message.message
  }
  const productName = Platform.productNameLong
  const result = await Electron.dialog.showMessageBox(focusedWindow, {
    type,
    message,
    title: productName,
    buttons,
    cancelId: 1,
    detail,
    noLink: true,
  })
  const selectedButtonIndex = result.response
  return selectedButtonIndex
}
