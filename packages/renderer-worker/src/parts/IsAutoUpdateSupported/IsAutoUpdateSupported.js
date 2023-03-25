import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const isAutoUpdateSupported = () => {
  if (Platform.platform !== PlatformType.Electron) {
    return false
  }
  return ElectronProcess.invoke('IsAutoUpdateSupported.isAutoUpdateSupported')
}
