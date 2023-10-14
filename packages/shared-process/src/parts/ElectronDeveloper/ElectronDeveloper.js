import * as ParentIpc from '../ParentIpc/ParentIpc.js'

export const getPerformanceEntries = () => {
  return ParentIpc.invoke('ElectronDeveloper.getPerformanceEntries')
}
