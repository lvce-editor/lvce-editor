import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

export const getPerformanceEntries = () => {
  return ElectronProcess.invoke('ElectronDeveloper.getPerformanceEntries')
}
