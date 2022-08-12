const Electron = require('../Electron/Electron.js')
const Window = require('../Window/Window.js')
const Assert = require('../Assert/Assert.js')
const Platform = require('../Platform/Platform.js')
const { setTimeout } = require('timers/promises')

/**
 * artificial timeout to work around electron bug https://github.com/electron/electron/issues/31449
 */
const enableElectronFreezeDesktopWorkaround = async () => {
  await setTimeout(140)
}

exports.showOpenDialog = async () => {
  const focusedWindow = Window.getFocusedWindow()
  if (!focusedWindow) {
    return
  }
  await enableElectronFreezeDesktopWorkaround()
  const result = await Electron.dialog.showOpenDialog(focusedWindow, {
    properties: ['openDirectory', 'dontAddToRecent'],
    title: 'Open Folder',
  })
  if (result.canceled || result.filePaths.length !== 1) {
    return
  }
  console.log(result)
  // TODO maybe return whole result (including canceled or not)
  return result.filePaths
}

exports.showMessageBox = async (message, buttons) => {
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
  const appName = Platform.getApplicationName()
  const result = await Electron.dialog.showMessageBox(focusedWindow, {
    type: 'error',
    message,
    title: appName,
    buttons,
    cancelId: 1,
  })
  const selectedButtonIndex = result.response
  return selectedButtonIndex
}
