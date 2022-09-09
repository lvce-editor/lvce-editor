import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'

/**
 *
 * @param {'prevent-app-suspension'|'prevent-display-sleep'} type
 * @returns
 */
export const start = (type) => {
  return ElectronProcess.invoke('ElectronPowerSaveBlocker.start', type)
}

/**
 * @param {number} id
 */
export const stop = (id) => {
  return ElectronProcess.invoke('ElectronPowerSaveBlocker.stop', id)
}
