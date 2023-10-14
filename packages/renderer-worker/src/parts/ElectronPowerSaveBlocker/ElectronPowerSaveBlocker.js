import * as SharedProcess from '../SharedProcess/SharedProcess.js'

/**
 *
 * @param {'prevent-app-suspension'|'prevent-display-sleep'} type
 * @returns
 */
export const start = (type) => {
  return SharedProcess.invoke('ElectronPowerSaveBlocker.start', type)
}

/**
 * @param {number} id
 */
export const stop = (id) => {
  return SharedProcess.invoke('ElectronPowerSaveBlocker.stop', id)
}
