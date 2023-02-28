const ElectronNet = require('./ElectronNet.js')

exports.name = 'ElectronNet'

// prettier-ignore
exports.Commands = {
  getJson: ElectronNet.getJson,
}
