const Developer = require('./ElectronDeveloper.js')

// prettier-ignore
exports.Commands =  {
  'ElectronDeveloper.crashMainProcess': Developer.crashMainProcess,
  'ElectronDeveloper.getPerformanceEntries': Developer.getPerformanceEntries,
}
