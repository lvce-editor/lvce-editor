const EXTENSION_HOST_WORKER_URL =
  '/packages/extension-host-worker/src/extensionHostWorkerMain.js'

const tryToGetActualErrorMessage = async (extensionHostWorkerUrl) => {
  try {
    const response = await fetch(extensionHostWorkerUrl)
    switch (response.status) {
      case 404:
        return 'Failed to start extension host worker: Not found (404)'
      default:
        return 'Failed to start extension host worker: Unknown Error'
    }
  } catch (error) {
    return 'Failed to start extension host worker: Unknown Error'
  }
}

export const listen = async () => {
  // TODO implement message port fallback for this
  const worker = new Worker(EXTENSION_HOST_WORKER_URL, {
    type: 'module',
    name: 'Extension Host',
  })
  await new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.onmessage = null
      worker.onerror = null
    }
    const handleFirstMessage = (event) => {
      cleanup()
      if (event.data === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('unexpected first message from extension host worker'))
      }
    }
    const handleFirstError = async (event) => {
      console.log(event)
      cleanup()

      const actualErrorMessage = await tryToGetActualErrorMessage(
        EXTENSION_HOST_WORKER_URL
      )
      reject(new Error(actualErrorMessage))
    }
    worker.onmessage = handleFirstMessage
    worker.onerror = handleFirstError
  })
  return {
    get onmessage() {
      return worker.onmessage
    },
    set onmessage(listener) {
      worker.onmessage = listener
    },
    dispose() {
      worker.terminate()
    },
    send(message) {
      worker.postMessage(message)
    },
  }
}
