const Command = require('../Command/Command.js')
const Developer = require('./Developer.js')

exports.__initialize__ = () => {
  Command.register(7722, Developer.getPerformanceEntries)
  Command.register(7723, Developer.crashMainProcess)
}
