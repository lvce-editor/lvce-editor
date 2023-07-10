const AppWindow = require('./AppWindow.cjs')

exports.name = 'AppWindow'

exports.Commands = {
  createAppWindow: AppWindow.createAppWindow,
  openNew: AppWindow.openNew,
}
