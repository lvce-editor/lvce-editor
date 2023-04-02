import * as AutoUpdater from './AutoUpdater.js'

export const name = 'AutoUpdater'

export const Commands = {
  checkForUpdatesAndNotify: AutoUpdater.checkForUpdatesAndNotify,
  downloadUpdate: AutoUpdater.downloadUpdate,
  installAndRestart: AutoUpdater.installAndRestart,
}
