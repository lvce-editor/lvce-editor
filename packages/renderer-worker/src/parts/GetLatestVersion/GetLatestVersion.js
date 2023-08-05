import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getLatestVersion = () => {
  return SharedProcess.invoke('AutoUpdater.getLatestVersion')
}
