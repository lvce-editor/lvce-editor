import * as Platform from '../Platform/Platform.js'

const tryToGetActualErrorMessage = async (extensionHostWorkerUrl) => {
  try {
    await import(extensionHostWorkerUrl)
    return 'Failed to start extension host worker: Unknown Error'
  } catch (error) {
    if (
      error &&
      error.message.startsWith('Failed to fetch dynamically imported module')
    ) {
      try {
        const response = await fetch(extensionHostWorkerUrl)
        switch (response.status) {
          case 404:
            return 'Failed to start extension host worker: Not found (404)'
          default:
            return 'Failed to start extension host worker: Unknown Network Error'
        }
      } catch (error) {
        return 'Failed to start extension host worker: Unknown Network Error'
      }
    }
    return `Failed to start extension host worker: ${error}`
  }
}

export const listen = async () => {
  const extensionHostWorkerUrl = Platform.getExtensionHostWorkerUrl()
  // TODO implement message port fallback for this
  const worker = new Worker(extensionHostWorkerUrl, {
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
        extensionHostWorkerUrl
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
