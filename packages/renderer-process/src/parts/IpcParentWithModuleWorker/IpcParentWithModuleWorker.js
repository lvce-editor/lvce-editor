import * as GetWorkerDisplayName from '../GetWorkerDisplayName/GetWorkerDisplayName.js'
import * as WorkerType from '../WorkerType/WorkerType.js'
import * as IsFirefoxWorkerError from '../IsFirefoxWorkerError/IsFirefoxWorkerError.js'
import { ModuleWorkersAreNotSupportedInFirefoxError } from '../ModuleWorkersAreNotSupportedInFirefoxError/ModuleWorkersAreNotSupportedInFirefoxError.js'

const tryToGetActualErrorMessage = async ({ url, name }) => {
  const displayName = GetWorkerDisplayName.getWorkerDisplayName(name)
  try {
    globalThis.DONT_EXECUTE = 1
    await import(url)
    return `Failed to start ${displayName}: Unknown Error`
  } catch (error) {
    if (error && error instanceof Error && error.message.startsWith('Failed to fetch dynamically imported module')) {
      try {
        const response = await fetch(url)
        switch (response.status) {
          case 404:
            return `Failed to start ${displayName}: Not found (404)`
          default:
            return `Failed to start ${displayName}: Unknown Network Error`
        }
      } catch {
        return `Failed to start ${displayName}: Unknown Network Error`
      }
    }
    return `Failed to start ${displayName}: ${error}`
  }
}

export const create = async ({ url, name }) => {
  try {
    const worker = new Worker(url, {
      type: WorkerType.Module,
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
        if (IsFirefoxWorkerError.isFirefoxWorkerError(event.message)) {
          event.preventDefault()
          reject(new ModuleWorkersAreNotSupportedInFirefoxError())
        } else {
          const actualErrorMessage = await tryToGetActualErrorMessage({
            url,
            name,
          })
          reject(new Error(actualErrorMessage))
        }
      }
      worker.onmessage = handleFirstMessage
      worker.onerror = handleFirstError
    })
    return worker
  } catch (error) {
    if (error && error instanceof ModuleWorkersAreNotSupportedInFirefoxError) {
      const IpcParentWithMessagePort = await import('../IpcParentWithMessagePort/IpcParentWithMessagePort.js')
      return IpcParentWithMessagePort.create({ url })
    }
    throw error
  }
}
