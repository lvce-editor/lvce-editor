const Developer = require('./ElectronDeveloper.js')

exports.name = 'ElectronDeveloper'

// prettier-ignore
exports.Commands =  {
  crashMainProcess: Developer.crashMainProcess,
  getPerformanceEntries: Developer.getPerformanceEntries,
}
