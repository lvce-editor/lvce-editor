import * as Sandbox from '../Sandbox/Sandbox.ts'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const getIframeSandbox = (webView: any): readonly string[] => {
  const extensionSandbox = webView.sandbox || []
  if (Platform.platform === PlatformType.Remote) {
    return [Sandbox.AllowScripts, Sandbox.AllowSameOrigin, ...extensionSandbox] // TODO maybe disallow same origin
  }
  if (Platform.platform === PlatformType.Web) {
    return [Sandbox.AllowScripts, ...extensionSandbox]
  }
  // TODO set something for electron
  return [...extensionSandbox]
}
