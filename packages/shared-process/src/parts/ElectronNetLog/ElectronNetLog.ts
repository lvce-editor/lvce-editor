import * as ParentIpc from '../MainProcess/MainProcess.ts'

/**
 * @param {string} path
 */
export const startLogging = (path: any): any => {
  return ParentIpc.invoke('ElectronNetLog.startLogging', path)
}

export const stopLogging = (): any => {
  return ParentIpc.invoke('ElectronNetLog.stopLogging')
}
