const Beep = require('./ElectronBeep.js')

exports.name = 'ElectronBeep'

exports.Commands = {
  beep: Beep.beep,
}
