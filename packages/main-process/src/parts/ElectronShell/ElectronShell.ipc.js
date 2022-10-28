const ElectronShell = require('./ElectronShell.js')

exports.Commands = {
  'ElectronShell.beep': ElectronShell.beep,
  'ElectronShell.showItemInFolder': ElectronShell.showItemInFolder,
  'ElectronShell.openExternal': ElectronShell.openExternal,
}
