import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getPerformanceEntries = () => {
  return SharedProcess.invoke('ElectronDeveloper.getPerformanceEntries')
}

export const takeWorkerHeapSnapshot = (windowId, workerName) => {
  return SharedProcess.invoke('ElectronDeveloper.takeWorkerHeapSnapshot', windowId, workerName)
}
