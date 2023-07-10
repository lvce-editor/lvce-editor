const ElectronShell = require('./ElectronShell.cjs')

exports.name = 'ElectronShell'

exports.Commands = {
  beep: ElectronShell.beep,
  openExternal: ElectronShell.openExternal,
  openPath: ElectronShell.showItemInFolder,
  showItemInFolder: ElectronShell.showItemInFolder,
}
