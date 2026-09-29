import * as ParentIpc from '../MainProcess/MainProcess.ts'

/**
 * @param {string} url
 */
export const getJson = (url: any): any => {
  return ParentIpc.invoke('ElectronNet.getJson', url)
}
