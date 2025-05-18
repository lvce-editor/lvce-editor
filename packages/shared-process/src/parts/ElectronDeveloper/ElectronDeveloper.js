import * as ParentIpc from '../MainProcess/MainProcess.js'

export const getPerformanceEntries = () => {
  return ParentIpc.invoke('ElectronDeveloper.getPerformanceEntries')
}
