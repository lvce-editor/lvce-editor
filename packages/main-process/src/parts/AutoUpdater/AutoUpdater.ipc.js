const AutoUpdater = require('./AutoUpdater.js')

exports.name = 'AutoUpdater'

exports.Commands = {
  checkForUpdatesAndNotify: AutoUpdater.checkForUpdatesAndNotify,
  downloadUpdate: AutoUpdater.downloadUpdate,
  hydrate: AutoUpdater.hydrate,
  quitAndInstall: AutoUpdater.quitAndInstall,
}
