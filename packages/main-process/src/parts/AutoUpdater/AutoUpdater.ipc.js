const AutoUpdater = require('./AutoUpdater.js')

exports.name = 'AutoUpdater'

exports.Commands = {
  checkForUpdatesAndNotify: AutoUpdater.checkForUpdatesAndNotify,
  quitAndInstall: AutoUpdater.quitAndInstall,
  hydrate: AutoUpdater.hydrate,
}
