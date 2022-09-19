import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const crashMainProcess = () => {
  return ElectronProcess.invoke('ElectronDeveloper.crashMainProcess')
}

export const getPerformanceEntries = () => {
  return ElectronProcess.invoke('ElectronDeveloper.getPerformanceEntries')
}
