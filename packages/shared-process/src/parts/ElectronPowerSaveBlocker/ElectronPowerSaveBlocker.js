import * as ParentIpc from '../MainProcess/MainProcess.js'

/**
 *
 * @param {'prevent-app-suspension'|'prevent-display-sleep'} type
 * @returns
 */
export const start = (type) => {
  return ParentIpc.invoke('ElectronPowerSaveBlocker.start', type)
}

/**
 * @param {number} id
 */
export const stop = (id) => {
  return ParentIpc.invoke('ElectronPowerSaveBlocker.stop', id)
}
