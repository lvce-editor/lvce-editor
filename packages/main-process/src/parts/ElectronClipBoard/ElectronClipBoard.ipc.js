const ElectronClipBoard = require('./ElectronClipBoard.js')

exports.name = 'ElectronClipBoard'

exports.Commands = {
  writeText: ElectronClipBoard.writeText,
}
