import * as Event from '../Event/Event.js'
import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.js'
import * as GetFirstWorkerEvent from '../GetFirstWorkerEvent/GetFirstWorkerEvent.js'
import * as IsFirefoxWorkerError from '../IsFirefoxWorkerError/IsFirefoxWorkerError.js'
import { ModuleWorkersAreNotSupportedInFirefoxError } from '../ModuleWorkersAreNotSupportedInFirefoxError/ModuleWorkersAreNotSupportedInFirefoxError.js'
import * as WorkerType from '../WorkerType/WorkerType.js'

export const create = async ({ url, name }) => {
  try {
    const worker = new Worker(url, {
      type: WorkerType.Module,
      name,
    })
    const { type, event } = await GetFirstWorkerEvent.getFirstWorkerEvent(worker)
    switch (type) {
      case FirstWorkerEventType.Message:
        if (event.data !== 'ready') {
          throw new Error('unexpected first message from worker')
        }
        break
      case FirstWorkerEventType.Error:
        if (IsFirefoxWorkerError.isFirefoxWorkerError(event.message)) {
          Event.preventDefault(event)
          throw new ModuleWorkersAreNotSupportedInFirefoxError()
        }
        const TryToGetActualWorkerErrorMessage = await import('../TryToGetActualWorkerErrorMessage/TryToGetActualWorkerErrorMessage.js')
        const actualErrorMessage = await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({
          url,
          name,
        })
        throw new Error(actualErrorMessage)
      default:
        break
    }
    return worker
  } catch (error) {
    if (error && error instanceof ModuleWorkersAreNotSupportedInFirefoxError) {
      const IpcParentWithMessagePort = await import('../IpcParentWithMessagePort/IpcParentWithMessagePort.js')
      return IpcParentWithMessagePort.create({ url })
    }
    throw error
  }
}

const getActualData = (event) => {
  // TODO why are some events not instance of message event?
  if (event instanceof MessageEvent) {
    const message = event.data
    return message
  }
  return event
}

export const wrap = (worker) => {
  console.log({ worker })
  return {
    handleMessage: undefined,
    worker,
    get onmessage() {
      return this.handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        this.handleMessage = (event) => {
          const data = getActualData(event)
          console.log({ data })
          listener(data)
        }
      } else {
        this.handleMessage = null
      }
      this.worker.onmessage = this.handleMessage
    },
    send(message) {
      this.worker.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.worker.postMessage(message, transfer)
    },
  }
}
