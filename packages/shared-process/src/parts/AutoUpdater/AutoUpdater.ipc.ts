import * as AutoUpdater from './AutoUpdater.ts'

export const Commands = {
  'AutoUpdater.getAutoUpdateType': AutoUpdater.getAutoUpdateType,
  'AutoUpdater.getLatestVersion': AutoUpdater.getLatestVersion,
  'AutoUpdater.getPlatform': AutoUpdater.getPlatform,
  'AutoUpdater.restartMacUpdate': AutoUpdater.restartMacUpdate,
  'AutoUpdater.stageMacUpdate': AutoUpdater.stageMacUpdate,
}
