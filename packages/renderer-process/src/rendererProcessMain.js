import * as Platform from './parts/Platform/Platform.js'
import * as PlatformType from './parts/PlatformType/PlatformType.js'
import * as RendererWorker from './parts/RendererWorker/RendererWorker.js'

const handleError = (error) => {
  if (`${error}` === 'Script error.') {
    // ignore errors from chrome extensions
    return
  }
  console.info(`[renderer-process] Unhandled Error: ${error}`)
  alert(error)
}

const handleUnhandledRejection = (event) => {
  console.info(`[renderer-process] Unhandled Rejection: ${event.reason}`)
  alert(event.reason)
}

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
}

const main = async () => {
  onerror = handleError
  onunhandledrejection = handleUnhandledRejection

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
