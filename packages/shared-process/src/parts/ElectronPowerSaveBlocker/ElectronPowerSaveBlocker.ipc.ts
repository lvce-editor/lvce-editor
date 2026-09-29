import * as ElectronPowerSaveBlocker from './ElectronPowerSaveBlocker.ts'

export const name = 'ElectronPowerSaveBlocker'

export const Commands = {
  start: ElectronPowerSaveBlocker.start,
  stop: ElectronPowerSaveBlocker.stop,
}
