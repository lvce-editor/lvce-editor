import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const SERVICE_WORKER_URL = '/serviceWorker.js'

export const hydrate = async () => {
  if (Platform.platform === 'electron') {
    return
  }
  if (!Preferences.get('serviceWorker.enabled')) {
    return
  }
  try {
    await RendererProcess.invoke(
      /* ServiceWorker.register */ 43725,
      /* url */ SERVICE_WORKER_URL
    )
  } catch (error) {
    if (error.message === 'A Service Worker has been blocked for this domain') {
      // ignore
    } else {
      console.info(`service worker could not be registered: ${error}`)
    }
  }
}

export const uninstall = async () => {
  if (Platform.platform === 'electron') {
    return
  }
  try {
    await RendererProcess.invoke(/* ServiceWorker.uninstall */ 42726)
  } catch (error) {
    console.info(`service worker could not be unregistered: ${error}`)
  }
}
