const ElectronDialog = require('../ElectronDialog/ElectronDialog.js')
const ElectronMessageBoxType = require('../ElectronMessageBoxType/ElectronMessageBoxType.js')
const Process = require('../Process/Process.js')
const Platform = require('../Platform/Platform.js')
const ElectronClipBoard = require('../ElectronClipBoard/ElectronClipBoard.js')

/**
 * @enum {string}
 */
const UiStrings = {
  Ok: 'Ok',
  Copy: 'Copy',
}

const getDetailString = () => {
  const electronVersion = Process.getElectronVersion()
  const nodeVersion = Process.getNodeVersion()
  const chromeVersion = Process.getChromeVersion()
  const version = Platform.version
  const v8Version = Process.getV8Version()
  const commit = Platform.commit

  const lines = [
    `Version: ${version}`,
    `Commit: ${commit}`,
    `Electron: ${electronVersion}`,
    `Chromium: ${chromeVersion}`,
    `Node: ${nodeVersion}`,
    `V8: ${v8Version}`,
  ]
  return lines.join('\n')
}

exports.showAbout = async () => {
  const detail = getDetailString()
  const result = await ElectronDialog.showMessageBox(
    Platform.ProductName,
    [UiStrings.Copy, UiStrings.Ok],
    ElectronMessageBoxType.Info,
    detail
  )
  switch (result) {
    case 0:
      ElectronClipBoard.writeText(detail)
      break
    case 1:
    default:
      break
  }
}
