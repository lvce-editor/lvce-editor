import * as GetLatestVersion from '../GetLatestVersion/GetLatestVersion.js'
import * as GetWindowId from '../GetWindowId/GetWindowId.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Notification from '../Notification/Notification.js'
import * as UpdateWorker from '../UpdateWorker/UpdateWorker.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

const getErrorMessage = (error) => {
  if (error && error.message) {
    return error.message
  }
  return `${error}`
}

export const checkForUpdatesWithDependencies = async (updateSetting, silent, dependencies) => {
  const repository = 'lvce-editor/lvce-editor'
  if (silent) {
    await dependencies.startUpdate(updateSetting, repository)
    return
  }
  const notificationId = await dependencies.notify('info', 'Checking for updates...')
  try {
    const latest = await dependencies.getLatestVersion()
    if (!latest) {
      await dependencies.updateNotification(notificationId, 'No Update available')
      return
    }
    await dependencies.updateNotification(notificationId, `Update ${latest.version} is available.`)
    await dependencies.startUpdate(updateSetting, repository)
  } catch (error) {
    await dependencies.updateNotification(notificationId, `Failed to check for updates: ${getErrorMessage(error)}`)
  }
}

export const checkForUpdates = async (updateSetting, silent = Boolean(updateSetting)) => {
  if (Platform.getPlatform() === PlatformType.Electron && (await SharedProcess.invoke('AutoUpdater.getPlatform')) === 'win32') {
    if (silent && updateSetting === 'none') {
      return
    }
    try {
      const windowId = await GetWindowId.getWindowId()
      const handled = await SharedProcess.invoke('AutoUpdater.checkWindowsUpdate', silent, windowId)
      if (handled) {
        return
      }
    } catch (error) {
      await Notification.create('error', `Failed to prepare update: ${getErrorMessage(error)}`)
      return
    }
  }
  await checkForUpdatesWithDependencies(updateSetting, silent, {
    getLatestVersion: GetLatestVersion.getLatestVersion,
    notify: Notification.create,
    updateNotification: Notification.update,
    startUpdate: async (setting, repository) => {
      const result = await UpdateWorker.invoke('Update.checkForUpdates', setting, repository)
      if (result?.error) {
        await Notification.create('error', `Failed to install update: ${result.error}`)
      }
    },
  })
}

export const getPlatform = () => SharedProcess.invoke('AutoUpdater.getPlatform')

export const stageMacUpdate = (diskPath, version) => SharedProcess.invoke('AutoUpdater.stageMacUpdate', diskPath, version)

export const restartMacUpdate = () => SharedProcess.invoke('AutoUpdater.restartMacUpdate')
