const Command = require('../Command/Command.js')
const App = require('./App.js')

exports.__initialize__ = () => {
  Command.register('App.exit', App.exit)
}
