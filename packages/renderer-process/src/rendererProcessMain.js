import * as Command from './parts/Command/Command.js'
import * as ErrorHandling from './parts/ErrorHandling/ErrorHandling.js'
import * as Module from './parts/Module/Module.js'
import * as Platform from './parts/Platform/Platform.js'
import * as PlatformType from './parts/PlatformType/PlatformType.js'
import * as RendererWorker from './parts/RendererWorker/RendererWorker.js'

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
}

const main = async () => {
  onerror = ErrorHandling.handleError
  onunhandledrejection = ErrorHandling.handleUnhandledRejection
  Command.setLoad(Module.load)
  if (Platform.platform === PlatformType.Web) {
    // disable prompt to download app as pwa
    // @ts-ignore
    window.onbeforeinstallprompt = handleBeforeInstallPrompt
  }
  // TODO this is discovered very late
  await RendererWorker.hydrate()
}

main()

export const send = RendererWorker.send
