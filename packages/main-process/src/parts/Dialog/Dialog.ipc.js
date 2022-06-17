const Command = require('../Command/Command.js')
const Dialog = require('./Dialog.js')

exports.__initialize__ = () => {
  Command.register(20100, Dialog.showOpenDialog)
  Command.register(20101, Dialog.showMessageBox)
}
