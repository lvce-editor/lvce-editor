import * as ParentIpc from '../ParentIpc/ParentIpc.js'

/**
 * @param {string} url
 */
export const getJson = (url) => {
  return ParentIpc.invoke('ElectronNet.getJson', url)
}
