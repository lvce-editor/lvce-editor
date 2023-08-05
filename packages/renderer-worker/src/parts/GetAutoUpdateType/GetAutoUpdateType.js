import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getAutoUpdateType = () => {
  return SharedProcess.invoke('AutoUpdater.getAutoUpdateType')
}
