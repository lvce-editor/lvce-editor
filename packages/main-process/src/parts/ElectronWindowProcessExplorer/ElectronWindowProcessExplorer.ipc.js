const ElectronWindowProcessExplorer = require('./ElectronWindowProcessExplorer.js')

exports.name = 'ElectronWindowProcessExplorer'

// prettier-ignore
exports.Commands =  {
  open: ElectronWindowProcessExplorer.open
}
