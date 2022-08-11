const Command = require('../Command/Command.js')
const Developer = require('./Developer.js')

// prettier-ignore
exports.__initialize__ = () => {
  Command.register('Developer.getPerformanceEntries', Developer.getPerformanceEntries)
  Command.register('Developer.crashMainProcess', Developer.crashMainProcess)
}
