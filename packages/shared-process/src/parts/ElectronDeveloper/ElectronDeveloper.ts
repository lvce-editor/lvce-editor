import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getPerformanceEntries = (): any => {
  return ParentIpc.invoke('ElectronDeveloper.getPerformanceEntries')
}
