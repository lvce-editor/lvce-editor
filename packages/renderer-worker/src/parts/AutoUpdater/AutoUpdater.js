import * as AutoUpdaterModule from '../AutoUpdaterModule/AutoUpdaterModule.js'
import * as AutoUpdaterStrings from '../AutoUpdaterStrings/AutoUpdaterStrings.js'
import * as Command from '../Command/Command.js'
import * as GetAutoUpdateType from '../GetAutoUpdateType/GetAutoUpdateType.js'
import * as GetLatestVersion from '../GetLatestVersion/GetLatestVersion.js'

export const checkForUpdates = async () => {
  const info = await GetLatestVersion.getLatestVersion()
  if (!info || !info.version) {
    return
  }
  const type = await GetAutoUpdateType.getAutoUpdateType()
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
