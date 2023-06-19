import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Process from '../Process/Process.js'
import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const getDetailString = async () => {
  const [electronVersion, nodeVersion, chromeVersion, version, commit, v8Version] = await Promise.all([
    Process.getElectronVersion(),
    Process.getNodeVersion(),
    Process.getChromeVersion(),
    Process.getVersion(),
    Process.getCommit(),
    Process.getV8Version(),
  ])
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

export const getProductNameLong = () => {
  return ElectronProcess.invoke('Platform.getProductNameLong')
}
