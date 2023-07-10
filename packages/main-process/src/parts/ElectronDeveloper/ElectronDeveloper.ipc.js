import * as Developer from './ElectronDeveloper.js'

export const name = 'ElectronDeveloper'

export const Commands = {
  crashMainProcess: Developer.crashMainProcess,
  getPerformanceEntries: Developer.getPerformanceEntries,
}
