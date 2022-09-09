const ElectronNetLog = require('./ElectronNetLog.js')

// prettier-ignore
exports.Commands = {
  'ElectronNetLog.startLogging': ElectronNetLog.startLogging,
  'ElectronNetLog.stopLogging': ElectronNetLog.stopLogging,
}
