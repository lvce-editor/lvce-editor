const Dialog = require('./ElectronDialog.js')

exports.Commands = {
  'ElectronDialog.showMessageBox': Dialog.showMessageBox,
  'ElectronDialog.showOpenDialog': Dialog.showOpenDialog,
}
