import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

/**
 * @param {string} path
 */
export const startLogging = (path) => {
  return ElectronProcess.invoke('ElectronNetLog.startLogging', path)
}

export const stopLogging = () => {
  return ElectronProcess.invoke('ElectronNetLog.stopLogging')
}
