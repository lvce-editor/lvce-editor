import * as AutoUpdaterModule from '../AutoUpdaterModule/AutoUpdaterModule.js'
import * as AutoUpdaterStrings from '../AutoUpdaterStrings/AutoUpdaterStrings.js'
import * as Command from '../Command/Command.js'
import * as GetAutoUpdateType from '../GetAutoUpdateType/GetAutoUpdateType.js'
import * as GetLatestVersion from '../GetLatestVersion/GetLatestVersion.js'

const getShouldUpdate = async (updateSetting, version) => {
  if (updateSetting && updateSetting !== 'none') {
    return true
  }
  const message = AutoUpdaterStrings.promptMessage(version)
  const shouldUpdate = await Command.execute('ConfirmPrompt.prompt', message)
  return shouldUpdate
}

export const checkForUpdates = async (updateSetting) => {
  const info = await GetLatestVersion.getLatestVersion()
  if (!info || !info.version) {
    return
  }
  const type = await GetAutoUpdateType.getAutoUpdateType()
  const shouldUpdate = await getShouldUpdate(updateSetting, info.version)
  if (!shouldUpdate) {
    return
  }
  const module = await AutoUpdaterModule.getModule(type)
  if (!module) {
    return
  }
  await Command.execute('Layout.setUpdateState', {
    state: 'downloading',
    progress: 0,
  })
  const downloadPath = await module.downloadUpdate(info.version)
  const messageRestart = AutoUpdaterStrings.promptRestart()
  const shouldRestart = await Command.execute('ConfirmPrompt.prompt', messageRestart)
  if (!shouldRestart) {
    return
  }
  await module.installAndRestart(downloadPath)
}
