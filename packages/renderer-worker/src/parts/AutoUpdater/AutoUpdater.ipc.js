import * as AutoUpdater from './AutoUpdater.js'

export const name = 'AutoUpdater'

export const Commands = {
  getPlatform: AutoUpdater.getPlatform,
  stageMacUpdate: AutoUpdater.stageMacUpdate,
  restartMacUpdate: AutoUpdater.restartMacUpdate,
  checkForUpdates: AutoUpdater.checkForUpdates,
}
