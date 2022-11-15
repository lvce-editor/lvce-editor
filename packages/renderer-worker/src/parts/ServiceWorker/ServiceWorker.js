import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Id from '../Id/Id.js'
import * as Callback from '../Callback/Callback.js'

const SERVICE_WORKER_URL = '/serviceWorker.js'

export const register = async (url, scope) => {
  try {
    await RendererProcess.invoke(
      /* ServiceWorker.register */ 'ServiceWorker.register',
      /* url */ url,
      /* scope */ scope
    )
  } catch (error) {
    // @ts-ignore
    if (error.message === 'A Service Worker has been blocked for this domain') {
      // ignore
    } else {
      console.info(`service worker could not be registered: ${error}`)
    }
  }
}

export const hydrate = async () => {
  if (Platform.platform === 'electron') {
    return
  }
  if (!Preferences.get('serviceWorker.enabled')) {
    return
  }
  return register(SERVICE_WORKER_URL, '/')
}

export const uninstall = async () => {
  if (Platform.platform === 'electron') {
    return
  }
  try {
    await RendererProcess.invoke(
      /* ServiceWorker.uninstall */ 'ServiceWorker.uninstall'
    )
  } catch (error) {
    console.info(`service worker could not be unregistered: ${error}`)
  }
}

export const connect = async () => {
  const channel = new MessageChannel()
  const { port1, port2 } = channel
  await new Promise((resolve, reject) => {
    const callbackId = Callback.register(resolve, reject)
    RendererProcess.sendAndTransfer(
      {
        jsonrpc: '2.0',
        method: 'ServiceWorker.connect',
        id: callbackId,
        params: [port1],
      },
      [port1]
    )
  })
  return port2
}
