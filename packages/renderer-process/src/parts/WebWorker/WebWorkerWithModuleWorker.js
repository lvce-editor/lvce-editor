import * as WebWorkerWithMessagePort from './WebWorkerWithMessagePort.js'

export const create = async (url) => {
  try {
    const worker = new Worker(url, {
      type: 'module',
    })
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        worker.onmessage = null
        worker.onerror = null
      }
      const handleFirstMessage = () => {
        cleanup()
        resolve()
      }
      const handleFirstError = (event) => {
        cleanup()
        reject(event)
      }
      worker.onmessage = handleFirstMessage
      worker.onerror = handleFirstError
    })
    return worker
  } catch (error) {
    if (
      error &&
      [
        'SyntaxError: import declarations may only appear at top level of a module',
        'SyntaxError: export declarations may only appear at top level of a module',
        // @ts-ignore
      ].includes(error.message)
    ) {
      // @ts-ignore
      error.preventDefault()
      return WebWorkerWithMessagePort.create(url)
    }
    console.error(`Failed to start worker: ${error}`)
  }
}
