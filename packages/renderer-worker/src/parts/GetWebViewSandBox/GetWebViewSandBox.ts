import * as Sandbox from '../Sandbox/Sandbox.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getIframeSandbox = () => {
  if (Platform.platform === PlatformType.Remote) {
    return [Sandbox.AllowScripts, Sandbox.AllowSameOrigin]
  }
  if (Platform.platform === PlatformType.Web) {
    return []
  }
  return []
}
