import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getWebViewPort = (): string => {
  if (Platform.platform === PlatformType.Web) {
    return location.port
  }
  // TODO make port configurable
  return '3002'
}
