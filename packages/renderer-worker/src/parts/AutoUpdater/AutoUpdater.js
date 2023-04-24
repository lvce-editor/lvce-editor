import * as Assert from '../Assert/Assert.js'
import * as AutoUpdateType from '../AutoUpdateType/AutoUpdateType.js'
import * as Command from '../Command/Command.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getPromptMessage = (version) => {
  return `Do you want to update to version ${version}?`
}

const getPromptRestart = () => {
  return `The Update has been downloaded. Do you want to restart now?`
}

const downloadUpdateAppImage = (version) => {
  Assert.string(version)
  return SharedProcess.invoke('AutoUpdaterAppImage.downloadUpdate', version)
}

const downloadUpdateWindowsNsis = (version) => {
  Assert.string(version)
  return SharedProcess.invoke('AutoUpdaterWindowsNsis.downloadUpdate', version)
}

const downloadUpdate = (type, version) => {
  switch (type) {
    case AutoUpdateType.AppImage:
      return downloadUpdateAppImage(version)
    case AutoUpdateType.WindowsNsis:
      return downloadUpdateWindowsNsis(version)
    default:
      return ''
  }
}

const installAndRestartAppImage = (downloadPath) => {
  Assert.string(downloadPath)
  return SharedProcess.invoke('AutoUpdaterAppImage.installAndRestart', downloadPath)
}

const installAndRestartWindowsNsis = (downloadPath) => {
  Assert.string(downloadPath)
  return SharedProcess.invoke('AutoUpdaterWindowsNsis.installAndRestart', downloadPath)
}

const installAndRestart = (info, downloadPath) => {
  switch (info.type) {
    case AutoUpdateType.AppImage:
      return installAndRestartAppImage(downloadPath)
    case AutoUpdateType.WindowsNsis:
      return installAndRestartWindowsNsis(downloadPath)
    default:
      break
  }
}

const getLatestVersion = () => {
  return SharedProcess.invoke('AutoUpdater.getLatestVersion')
}

const getAutoUpdateType = () => {
  return SharedProcess.invoke('AutoUpdater.getAutoUpdateType')
}

export const checkForUpdates = async () => {
  const info = await getLatestVersion()
  if (info && info.version) {
    const type = await getAutoUpdateType()
    const message = getPromptMessage(info.version)
    const shouldUpdate = await Command.execute('ConfirmPrompt.prompt', message)
    if (!shouldUpdate) {
      return
    }
    const downloadPath = await downloadUpdate(type, info.version)
    const messageRestart = getPromptRestart()
    const shouldRestart = await Command.execute('ConfirmPrompt.prompt', messageRestart)
    if (!shouldRestart) {
      return
    }
    await installAndRestart(type, downloadPath)
  }
  console.log({ info })
}
