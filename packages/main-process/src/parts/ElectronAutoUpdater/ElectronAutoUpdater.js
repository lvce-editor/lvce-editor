const { autoUpdater } = require('electron')

exports.setFeedUrl = (options) => {
  autoUpdater.setFeedURL(options)
}

exports.getFeedUrl = () => {
  return autoUpdater.getFeedURL()
}

exports.checkForUpdates = () => {
  autoUpdater.checkForUpdates()
}

exports.quitAndInstall = () => {
  autoUpdater.quitAndInstall()
}
