const Command = require('../Command/Command.js')
const ProcessExplorer = require('./ProcessExplorer.js')

exports.__initialize__ = () => {
  Command.register(8822, ProcessExplorer.openProcessExplorer)
}
