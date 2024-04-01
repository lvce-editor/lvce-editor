import * as Command from '../Command/Command.ts'
import * as HandleBeforeInstallPrompt from '../HandleBeforeInstallPrompt/HandleBeforeInstallPrompt.js'
import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.js'
import * as Module from '../Module/Module.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as UnhandledErrorHandling from '../UnhandledErrorHandling/UnhandledErrorHandling.js'

export const main = async () => {
  onerror = UnhandledErrorHandling.handleUnhandledError
  onunhandledrejection = UnhandledErrorHandling.handleUnhandledRejection
  if ('SecurityPolicyViolationEvent' in self) {
    self.addEventListener('securitypolicyviolation', HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation)
  }
  Command.setLoad(Module.load)
  if (Platform.platform === PlatformType.Web) {
    // disable prompt to download app as pwa
    // @ts-ignore
    window.onbeforeinstallprompt = HandleBeforeInstallPrompt.handleBeforeInstallPrompt
  }
  // TODO this is discovered very late
  await RendererWorker.hydrate()
}
