export const listen = async () => {
  // TODO implement message port fallback for this
  const worker = new Worker(
    '/packages/extension-host-worker/src/extensionHostWorkerMain.js',
    {
      type: 'module',
      name: 'Extension Host',
    }
  )
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
    const handleFirstError = () => {
      cleanup()
      reject(new Error('Failed to start extension host worker'))
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
  }
}
