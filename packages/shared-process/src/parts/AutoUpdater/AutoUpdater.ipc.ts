import * as UpdateLog from '../UpdateLog/UpdateLog.ts'
import * as WindowsStagedUpdate from '../WindowsStagedUpdate/WindowsStagedUpdate.ts'
import * as AutoUpdater from './AutoUpdater.ts'

export const Commands = {
  'AutoUpdater.checkWindowsUpdate': WindowsStagedUpdate.check,
  'AutoUpdater.getAutoUpdateType': AutoUpdater.getAutoUpdateType,
  'AutoUpdater.getLatestVersion': AutoUpdater.getLatestVersion,
  'AutoUpdater.getPlatform': AutoUpdater.getPlatform,
  'AutoUpdater.restartMacUpdate': AutoUpdater.restartMacUpdate,
  'AutoUpdater.stageMacUpdate': AutoUpdater.stageMacUpdate,
  'AutoUpdater.writeLog': UpdateLog.write,
}
