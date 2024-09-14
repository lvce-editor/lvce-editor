import * as Sandbox from '../Sandbox/Sandbox.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getIframeSandbox = (): readonly string[] => {
  if (Platform.platform === PlatformType.Remote) {
    return [Sandbox.AllowScripts, Sandbox.AllowSameOrigin] // TODO maybe disallow same origin
  }
  if (Platform.platform === PlatformType.Web) {
    return [Sandbox.AllowScripts]
  }
  // TODO set something for electron
  return []
}
