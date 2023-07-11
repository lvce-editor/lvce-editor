import * as ElectronPowerSaveBlocker from './ElectronPowerSaveBlocker.js'

export const name = 'ElectronPowerSaveBlocker'

export const Commands = {
  start: ElectronPowerSaveBlocker.start,
  stop: ElectronPowerSaveBlocker.stop,
}
