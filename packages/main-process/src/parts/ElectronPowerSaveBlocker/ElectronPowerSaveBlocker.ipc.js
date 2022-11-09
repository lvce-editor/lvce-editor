const ElectronPowerSaveBlocker = require('./ElectronPowerSaveBlocker.js')

exports.name = 'ElectronPowerSaveBlocker'

exports.Commands = {
  start: ElectronPowerSaveBlocker.start,
  stop: ElectronPowerSaveBlocker.stop,
}
