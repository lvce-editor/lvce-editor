const { autoUpdater } = require('electron-updater')
const AutoUpdaterListeners = require('../AutoUpdaterListeners/AutoUpdaterListeners.js')
const IsAutoUpdateSupported = require('../IsAutoUpdateSupported/IsAutoUpdateSupported.js')
const Logger = require('../Logger/Logger.js')
const VError = require('verror')

exports.checkForUpdatesAndNotify = async () => {
  try {
    if (IsAutoUpdateSupported.useElectronBuilderAutoUpdate()) {
      return await autoUpdater.checkForUpdatesAndNotify()
    }
    const AutoUpdaterAppImage = require('../AutoUpdaterAppImage/AutoUpdaterAppImage.js')
    return await AutoUpdaterAppImage.checkForUpdatesAndNotify()
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to check for updates`)
  }
}

exports.on = (event, listener) => {
  autoUpdater.on(event, listener)
}

exports.downloadUpdate = async (version) => {
  try {
    if (IsAutoUpdateSupported.useElectronBuilderAutoUpdate()) {
      return
    }
    const AutoUpdaterAppImage = require('../AutoUpdaterAppImage/AutoUpdaterAppImage.js')
    return await AutoUpdaterAppImage.downloadUpdate(version)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download update`)
  }
}

exports.installAndRestart = async (downloadPath) => {
  try {
    if (IsAutoUpdateSupported.useElectronBuilderAutoUpdate()) {
      return
    }
    const AutoUpdaterAppImage = require('../AutoUpdaterAppImage/AutoUpdaterAppImage.js')
    return await AutoUpdaterAppImage.installAndRestart(downloadPath)
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to download update`)
  }
}

exports.quitAndInstall = () => {
  const isSilent = true
  const runAfter = true
  autoUpdater.quitAndInstall(isSilent, runAfter)
}

exports.hydrate = () => {
  Logger.info('[auto update] hydrating')
  autoUpdater.on('checking-for-update', AutoUpdaterListeners.handleCheckingForUpdate)
  autoUpdater.on('update-available', AutoUpdaterListeners.handleUpdateAvailable)
  autoUpdater.on('update-not-available', AutoUpdaterListeners.handleUpdateNotAvailable)
  autoUpdater.on('error', AutoUpdaterListeners.handleUpdateError)
  autoUpdater.on('download-progress', AutoUpdaterListeners.handleDownloadProgress)
  autoUpdater.on('update-downloaded', AutoUpdaterListeners.handleUpdateDownloaded)
}
