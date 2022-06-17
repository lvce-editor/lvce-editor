const Command = require('../Command/Command.js')
const Beep = require('./Beep.js')

exports.__initialize__ = () => {
  Command.register(50000, Beep.beep)
}
