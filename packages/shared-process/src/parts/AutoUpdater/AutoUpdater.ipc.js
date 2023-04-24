import * as AutoUpdater from './AutoUpdater.js'

export const name = 'AutoUpdater'

export const Commands = {
  getAutoUpdateType: AutoUpdater.getAutoUpdateType,
  getLatestVersion: AutoUpdater.getLatestVersion,
}
