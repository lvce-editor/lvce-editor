const { netLog } = require('electron')

exports.startLogging = async (path) => {
  await netLog.startLogging(path)
}

exports.stopLogging = async () => {
  await netLog.stopLogging()
}
