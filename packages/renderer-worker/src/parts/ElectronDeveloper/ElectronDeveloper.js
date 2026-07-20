import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getPerformanceEntries = () => {
  return SharedProcess.invoke('ElectronDeveloper.getPerformanceEntries')
}
