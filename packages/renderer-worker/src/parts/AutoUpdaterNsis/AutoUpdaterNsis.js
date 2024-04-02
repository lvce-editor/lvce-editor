import * as Assert from '../Assert/Assert.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const downloadUpdate = (version) => {
  Assert.string(version)
  return SharedProcess.invoke('AutoUpdaterWindowsNsis.downloadUpdate', version)
}

export const installAndRestart = (downloadPath) => {
  Assert.string(downloadPath)
  return SharedProcess.invoke('AutoUpdaterWindowsNsis.installAndRestart', downloadPath)
}
