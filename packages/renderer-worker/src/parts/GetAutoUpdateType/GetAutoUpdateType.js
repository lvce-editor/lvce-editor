import * as AutoUpdateType from '../AutoUpdateType/AutoUpdateType.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getAutoUpdateType = () => {
  if (Platform.getPlatform() === PlatformType.Web) {
    return AutoUpdateType.None
  }
  return SharedProcess.invoke('AutoUpdater.getAutoUpdateType')
}
