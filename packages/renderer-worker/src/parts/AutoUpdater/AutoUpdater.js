import * as GetLatestVersion from '../GetLatestVersion/GetLatestVersion.js'
import * as Notification from '../Notification/Notification.js'
import * as UpdateWorker from '../UpdateWorker/UpdateWorker.js'

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
  await dependencies.notify('info', 'Checking for updates...')
  try {
    const latest = await dependencies.getLatestVersion()
    if (!latest) {
      await dependencies.notify('info', 'You are using the latest version.')
      return
    }
    await dependencies.notify('info', `Update ${latest.version} is available.`)
    await dependencies.startUpdate(updateSetting, repository)
  } catch (error) {
    await dependencies.notify('error', `Failed to check for updates: ${getErrorMessage(error)}`)
  }
}

export const checkForUpdates = async (updateSetting, silent = Boolean(updateSetting)) => {
  await checkForUpdatesWithDependencies(updateSetting, silent, {
    getLatestVersion: GetLatestVersion.getLatestVersion,
    notify: Notification.create,
    startUpdate: async (setting, repository) => {
      await UpdateWorker.invoke('Update.checkForUpdates', setting, repository)
    },
  })
}
