import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getDefaultTitleBarHeight = () => {
  switch (Platform.platform) {
    case PlatformType.Electron:
      return 29
    default:
      return 20
  }
}
