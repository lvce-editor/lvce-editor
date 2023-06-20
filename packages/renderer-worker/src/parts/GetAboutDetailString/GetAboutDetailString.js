import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as FormatDate from '../FormatDate/FormatDate.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Process from '../Process/Process.js'

const formatDate = (isoDate) => {
  if (!isoDate) {
    return 'unknown'
  }
  const date = new Date(isoDate).getTime()
  const now = new Date().getTime()
  const ago = FormatDate.formatDate(date, now)
  return `${isoDate} (${ago})`
}

export const getDetailString = async () => {
  const [electronVersion, nodeVersion, chromeVersion, version, commit, v8Version, date] = await Promise.all([
    Process.getElectronVersion(),
    Process.getNodeVersion(),
    Process.getChromeVersion(),
    Process.getVersion(),
    Process.getCommit(),
    Process.getV8Version(),
    Process.getDate(),
  ])
  const formattedDate = formatDate(date)
  const lines = [
    `Version: ${version}`,
    `Commit: ${commit}`,
    `Date: ${formattedDate}`,
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
