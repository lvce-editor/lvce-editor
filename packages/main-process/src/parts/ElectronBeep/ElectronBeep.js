const { shell } = require('electron')

// TODO rename module to ElectronShell

exports.beep = () => {
  shell.beep()
}
