const JoinLines = require('../JoinLines/JoinLines.js')
const Platform = require('../Platform/Platform.js')
const Process = require('../Process/Process.js')

exports.getDetailString = () => {
  const electronVersion = Process.getElectronVersion()
  const nodeVersion = Process.getNodeVersion()
  const chromeVersion = Process.getChromeVersion()
  const { version, commit } = Platform
  const v8Version = Process.getV8Version()
  const lines = [
    `Version: ${version}`,
    `Commit: ${commit}`,
    `Electron: ${electronVersion}`,
    `Chromium: ${chromeVersion}`,
    `Node: ${nodeVersion}`,
    `V8: ${v8Version}`,
  ]
  return JoinLines.joinLines(lines)
}
