const Developer = require('./ElectronDeveloper.js')

// prettier-ignore
exports.Commands =  {
  'Developer.crashMainProcess': Developer.crashMainProcess,
  'Developer.getPerformanceEntries': Developer.getPerformanceEntries,
}
