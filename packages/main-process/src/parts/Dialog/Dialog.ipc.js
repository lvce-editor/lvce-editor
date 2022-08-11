const Command = require('../Command/Command.js')
const Dialog = require('./Dialog.js')

exports.__initialize__ = () => {
  Command.register('Dialog.showOpenDialog', Dialog.showOpenDialog)
  Command.register('Dialog.showMessageBox', Dialog.showMessageBox)
}
