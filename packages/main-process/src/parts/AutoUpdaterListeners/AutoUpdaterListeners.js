const Logger = require('../Logger/Logger.js')

exports.handleCheckingForUpdate = () => {
  Logger.info('[auto update] Checking for update...')
}

exports.handleUpdateAvailable = () => {
  Logger.info('[auto update] Update available.')
}

exports.handleUpdateNotAvailable = () => {
  Logger.info('[auto update] Update not available.')
}

exports.handleUpdateError = (error) => {
  Logger.info(`[auto update] Error in auto-updater. ${error}`)
}

exports.handleDownloadProgress = (progress) => {
  let log_message = 'Download speed: ' + progress.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progress.percent + '%'
  log_message = log_message + ' (' + progress.transferred + '/' + progress.total + ')'
  Logger.info(`[auto update] ${log_message}`)
}

exports.handleUpdateDownloaded = () => {
  Logger.info('[auto update] Update downloaded')
}
