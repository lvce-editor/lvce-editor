import * as Assert from '../Assert/Assert.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const downloadUpdate = (version) => {
  Assert.string(version)
  return SharedProcess.invoke('AutoUpdaterAppImage.downloadUpdate', version)
}

export const installAndRestart = (downloadPath) => {
  Assert.string(downloadPath)
  return SharedProcess.invoke('AutoUpdaterAppImage.installAndRestart', downloadPath)
}
