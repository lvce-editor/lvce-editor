const AppWindow = require('./AppWindow.js')

exports.name = 'AppWindow'

exports.Commands = {
  createAppWindow: AppWindow.createAppWindow,
  openNew: AppWindow.openNew,
}
