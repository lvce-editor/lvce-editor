import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 * @param {string} path
 */
export const startLogging = (path) => {
  return SharedProcess.invoke('ElectronNetLog.startLogging', path)
}

export const stopLogging = () => {
  return SharedProcess.invoke('ElectronNetLog.stopLogging')
}
