const Command = require('../Command/Command.js')
const Beep = require('./Beep.js')

exports.__initialize__ = () => {
  Command.register('Beep.beep', Beep.beep)
}
