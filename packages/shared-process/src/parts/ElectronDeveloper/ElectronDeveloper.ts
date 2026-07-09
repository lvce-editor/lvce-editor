import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getPerformanceEntries = () => {
  return ParentIpc.invoke('ElectronDeveloper.getPerformanceEntries')
}
