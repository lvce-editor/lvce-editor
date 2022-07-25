import * as WebWorkerWithMessagePort from './WebWorkerWithMessagePort.js'

export const create = async (url) => {
  try {
    const worker = new Worker(url, {
      type: 'module',
      name: 'Renderer Worker',
    })
    await new Promise((resolve, reject) => {
      const cleanup = () => {
        worker.onmessage = null
        worker.onerror = null
      }
      const handleFirstMessage = (event) => {
        cleanup()
        if (event.data === 'ready') {
          resolve()
        } else {
          reject(new Error('unexpected first message from renderer worker'))
        }
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
    throw new Error('Failed to start worker')
  }
}
