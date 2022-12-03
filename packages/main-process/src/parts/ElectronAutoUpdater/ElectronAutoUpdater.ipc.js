const ElectronAutoUpdater = require('./ElectronAutoUpdater.js')

exports.name = 'ElectronAutoUpdater'

// prettier-ignore
exports.Commands = {
  checkForUpdates: ElectronAutoUpdater.checkForUpdates,
  getFeedUrl: ElectronAutoUpdater.getFeedUrl,
  quitAndInstall: ElectronAutoUpdater.quitAndInstall,
  setFeedUrl: ElectronAutoUpdater.setFeedUrl,
}
