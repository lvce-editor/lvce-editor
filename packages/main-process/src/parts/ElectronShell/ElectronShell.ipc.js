const ElectronShell = require('./ElectronShell.js')

exports.name = 'ElectronShell'

exports.Commands = {
  beep: ElectronShell.beep,
  openExternal: ElectronShell.openExternal,
  showItemInFolder: ElectronShell.showItemInFolder,
  openPath: ElectronShell.showItemInFolder,
}
