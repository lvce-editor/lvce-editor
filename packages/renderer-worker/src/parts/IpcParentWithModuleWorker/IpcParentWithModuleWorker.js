import * as IsFirefoxWorkerError from '../IsFirefoxWorkerError/IsFirefoxWorkerError.js'
import { ModuleWorkersAreNotSupportedInFirefoxError } from '../ModuleWorkersAreNotSupportedInFirefoxError/ModuleWorkersAreNotSupportedInFirefoxError.js'
import * as TryToGetActualWorkerErrorMessage from '../TryToGetActualWorkerErrorMessage/TryToGetActualWorkerErrorMessage.js'
import * as WorkerType from '../WorkerType/WorkerType.js'

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
          reject(new Error('unexpected first message from worker'))
        }
      }
      const handleFirstError = async (event) => {
        cleanup()
        if (IsFirefoxWorkerError.isFirefoxWorkerError(event.message)) {
          event.preventDefault()
          reject(new ModuleWorkersAreNotSupportedInFirefoxError())
        } else {
          const actualErrorMessage = await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({
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

export const wrap = (worker) => {
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = event.data
            listener(message, event)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      worker.onmessage = handleMessage
    },
    send(message) {
      worker.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      worker.postMessage(message, transfer)
    },
  }
}
