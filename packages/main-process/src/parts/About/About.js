const ElectronDialog = require('../ElectronDialog/ElectronDialog.js')
const ElectronMessageBoxType = require('../ElectronMessageBoxType/ElectronMessageBoxType.js')
const Process = require('../Process/Process.js')
const Platform = require('../Platform/Platform.js')

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
  // TODO get message string
  // TODO show about dialog
  console.log('show about')
  const detail = getDetailString()
  await ElectronDialog.showMessageBox(
    Platform.ProductName,
    ['Ok'],
    ElectronMessageBoxType.Info,
    detail
  )
}
