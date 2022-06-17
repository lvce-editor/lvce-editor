const Command = require('../Command/Command.js')
const AppWindow = require('./AppWindow.js')

exports.__initialize__ = () => {
  Command.register(8527, AppWindow.createAppWindow)
}
