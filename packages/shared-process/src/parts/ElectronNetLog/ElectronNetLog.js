import * as ParentIpc from '../ParentIpc/ParentIpc.js'

/**
 * @param {string} path
 */
export const startLogging = (path) => {
  return ParentIpc.invoke('ElectronNetLog.startLogging', path)
}

export const stopLogging = () => {
  return ParentIpc.invoke('ElectronNetLog.stopLogging')
}
