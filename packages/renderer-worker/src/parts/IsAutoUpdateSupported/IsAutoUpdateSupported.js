import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const isAutoUpdateSupported = () => {
  if (Platform.getPlatform() !== PlatformType.Electron) {
    return false
  }
  return SharedProcess.invoke('IsAutoUpdateSupported.isAutoUpdateSupported')
}
