const Dialog = require('./ElectronDialog.js')

exports.Commands = {
  'ElectronDialog.showOpenDialog': Dialog.showOpenDialog,
  'ElectronDialog.showMessageBox': Dialog.showMessageBox,
}
