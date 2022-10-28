const ElectronShell = require('./ElectronShell.js')

exports.Commands = {
  'ElectronShell.beep': ElectronShell.beep,
  'ElectronShell.openExternal': ElectronShell.openExternal,
  'ElectronShell.showItemInFolder': ElectronShell.showItemInFolder,
}
