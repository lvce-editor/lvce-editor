import * as ParentIpc from '../MainProcess/MainProcess.ts'

export const getPerformanceEntries = (): any => {
  return ParentIpc.invoke('ElectronDeveloper.getPerformanceEntries')
}

export const takeWorkerHeapSnapshot = (windowId: number, workerName: string): Promise<string> => {
  return ParentIpc.invoke('ElectronDeveloper.takeWorkerHeapSnapshot', windowId, workerName)
}
