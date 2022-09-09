const ElectronPowerSaveBlocker = require('./ElectronPowerSaveBlocker.js')

exports.Commands = {
  'ElectronPowerSaveBlocker.start': ElectronPowerSaveBlocker.start,
  'ElectronPowerSaveBlocker.stop': ElectronPowerSaveBlocker.stop,
}
