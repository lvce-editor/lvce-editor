import * as Command from './parts/Command/Command.js'
import * as Event from './parts/Event/Event.js'
import * as HandleContentSecurityPolicyViolation from './parts/HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.js'
import * as Module from './parts/Module/Module.js'
import * as Platform from './parts/Platform/Platform.js'
import * as PlatformType from './parts/PlatformType/PlatformType.js'
import * as RendererWorker from './parts/RendererWorker/RendererWorker.js'
import * as UnhandledErrorHandling from './parts/UnhandledErrorHandling/UnhandledErrorHandling.js'

const handleBeforeInstallPrompt = (event) => {
  Event.preventDefault(event)
}

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
    window.onbeforeinstallprompt = handleBeforeInstallPrompt
  }
  // TODO this is discovered very late
  await RendererWorker.hydrate()
}
