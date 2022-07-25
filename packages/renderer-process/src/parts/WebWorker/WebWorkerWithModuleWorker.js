import * as WebWorkerWithMessagePort from './WebWorkerWithMessagePort.js'

const tryToGetActualErrorMessage = async (name, extensionHostWorkerUrl) => {
  try {
    await import(extensionHostWorkerUrl)
    return `Failed to start ${name} worker: Unknown Error`
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.startsWith('Failed to fetch dynamically imported module')
    ) {
      try {
        const response = await fetch(extensionHostWorkerUrl)
        switch (response.status) {
          case 404:
            return `Failed to start ${name} worker: Not found (404)`
          default:
            return `Failed to start ${name} worker: Unknown Network Error`
        }
      } catch {
        return `Failed to start ${name} worker: Unknown Network Error`
      }
    }
    return `Failed to start ${name} worker: ${error}`
  }
}

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
      const handleFirstError = async (event) => {
        cleanup()
        const actualErrorMessage = await tryToGetActualErrorMessage(
          'renderer worker',
          url
        )
        reject(new Error(actualErrorMessage))
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
    throw error
  }
}
