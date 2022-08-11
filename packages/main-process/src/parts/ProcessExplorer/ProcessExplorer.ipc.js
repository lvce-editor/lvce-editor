const Command = require('../Command/Command.js')
const ProcessExplorer = require('./ProcessExplorer.js')

// prettier-ignore
exports.__initialize__ = () => {
  Command.register('ProcessExplorer.openProcessExplorer', ProcessExplorer.openProcessExplorer)
}
