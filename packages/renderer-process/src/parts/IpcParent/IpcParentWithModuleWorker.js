// TODO lazyload fallback module
import * as IpcParentWithMessagePort from './IpcParentWithMessagePort.js'

const tryToGetActualErrorMessage = async (url, name) => {
  try {
    await import(url)
    return `Failed to start ${name} worker: Unknown Error`
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.startsWith('Failed to fetch dynamically imported module')
    ) {
      try {
        const response = await fetch(url)
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

export const create = async (url, name) => {
  try {
    const worker = new Worker(url, {
      type: 'module',
      name,
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
          reject(new Error('unexpected first message from renderer worker'))
        }
      }
      const handleFirstError = async (event) => {
        cleanup()
        const actualErrorMessage = await tryToGetActualErrorMessage(url, name)
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
      return IpcParentWithMessagePort.create(url)
    }
    throw error
  }
}
