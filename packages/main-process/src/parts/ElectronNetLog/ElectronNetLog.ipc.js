const ElectronNetLog = require('./ElectronNetLog.js')

exports.name = 'ElectronNetLog'

// prettier-ignore
exports.Commands = {
  startLogging: ElectronNetLog.startLogging,
  stopLogging: ElectronNetLog.stopLogging,
}
