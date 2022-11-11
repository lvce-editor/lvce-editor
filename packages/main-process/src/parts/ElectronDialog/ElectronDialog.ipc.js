const ElectronDialog = require('./ElectronDialog.js')

exports.name = 'ElectronDialog'

exports.Commands = {
  showMessageBox: ElectronDialog.showMessageBox,
  showOpenDialog: ElectronDialog.showOpenDialog,
}
