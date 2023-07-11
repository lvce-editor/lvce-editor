import * as AutoUpdaterModule from '../AutoUpdaterModule/AutoUpdaterModule.js'
import * as AutoUpdaterStrings from '../AutoUpdaterStrings/AutoUpdaterStrings.js'
import * as Command from '../Command/Command.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

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
    const message = AutoUpdaterStrings.promptMessage(info.version)
    const shouldUpdate = await Command.execute('ConfirmPrompt.prompt', message)
    if (!shouldUpdate) {
      return
    }
    const module = await AutoUpdaterModule.getModule(type)
    if (!module) {
      return
    }
    const downloadPath = await module.downloadUpdate(info.version)
    const messageRestart = AutoUpdaterStrings.promptRestart()
    const shouldRestart = await Command.execute('ConfirmPrompt.prompt', messageRestart)
    if (!shouldRestart) {
      return
    }
    await module.installAndRestart(downloadPath)
  }
  console.log({ info })
}
