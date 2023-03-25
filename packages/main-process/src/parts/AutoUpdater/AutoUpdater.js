const { autoUpdater } = require('electron-updater')
const Logger = require('../Logger/Logger.js')
const AutoUpdaterListeners = require('../AutoUpdaterListeners/AutoUpdaterListeners.js')
const VError = require('verror')

exports.checkForUpdatesAndNotify = async () => {
  try {
    return await autoUpdater.checkForUpdatesAndNotify()
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to check for updates`)
  }
}

exports.on = (event, listener) => {
  autoUpdater.on(event, listener)
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
