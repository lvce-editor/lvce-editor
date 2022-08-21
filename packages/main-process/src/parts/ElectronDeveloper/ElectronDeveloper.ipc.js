const Developer = require('./ElectronDeveloper.js')

// prettier-ignore
exports.Commands =  {
  'Developer.getPerformanceEntries': Developer.getPerformanceEntries,
  'Developer.crashMainProcess': Developer.crashMainProcess,
}
