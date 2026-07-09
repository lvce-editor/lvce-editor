import * as ParentIpc from '../MainProcess/MainProcess.ts'

/**
 * @param {string} url
 */
export const getJson = (url) => {
  return ParentIpc.invoke('ElectronNet.getJson', url)
}
