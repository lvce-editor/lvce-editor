import * as ParentIpc from '../MainProcess/MainProcess.js'

/**
 * @param {string} url
 */
export const getJson = (url) => {
  return ParentIpc.invoke('ElectronNet.getJson', url)
}
