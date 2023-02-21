const Electron = require('electron')
const Window = require('../ElectronWindow/ElectronWindow.js')
const Assert = require('../Assert/Assert.js')
const Platform = require('../Platform/Platform.js')
const Timeout = require('../Timeout/Timeout.js')
const ElectronMessageBoxType = require('../ElectronMessageBoxType/ElectronMessageBoxType.js')

/**
 * artificial timeout to work around electron bug https://github.com/electron/electron/issues/31449
 */
const enableElectronFreezeDesktopWorkaround = async () => {
  await Timeout.wait(140)
}

exports.showOpenDialog = async (title, properties) => {
  Assert.string(title)
  Assert.array(properties)
  const focusedWindow = Window.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  await enableElectronFreezeDesktopWorkaround()
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
  await enableElectronFreezeDesktopWorkaround()
  const focusedWindow = Window.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  if (message.message) {
    message = message.message
  }
  const productName = Platform.ProductName
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
