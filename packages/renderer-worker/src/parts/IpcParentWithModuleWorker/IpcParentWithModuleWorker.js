import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.js'
import * as GetFirstWorkerEvent from '../GetFirstWorkerEvent/GetFirstWorkerEvent.js'
import { IpcError } from '../IpcError/IpcError.js'
import * as TryToGetActualWorkerErrorMessage from '../TryToGetActualWorkerErrorMessage/TryToGetActualWorkerErrorMessage.js'
import * as WorkerType from '../WorkerType/WorkerType.js'

export const create = async ({ url, name }) => {
  const worker = new Worker(url, {
    type: WorkerType.Module,
    name,
  })
  const { type, event } = await GetFirstWorkerEvent.getFirstWorkerEvent(worker)
  switch (type) {
    case FirstWorkerEventType.Message:
      if (event.data !== 'ready') {
        throw new IpcError('unexpected first message from worker')
      }
      break
    case FirstWorkerEventType.Error:
      const actualErrorMessage = await TryToGetActualWorkerErrorMessage.tryToGetActualErrorMessage({
        url,
        name,
      })
      throw new Error(actualErrorMessage)
    default:
      break
  }
  return worker
}

const getMessage = (event) => {}

export const wrap = (worker) => {
  return {
    worker,
    /**
     * @type {any}
     */
    listener: undefined,
    get onmessage() {
      return this.listener
    },
    set onmessage(listener) {
      this.listener = listener
      const wrappedListener = (event) => {
        const message = getMessage(event)
        const syntheticEvent = {
          data: message,
          target: this,
        }
        listener(syntheticEvent)
      }
      this.worker.onmessage = wrappedListener
    },
    send(message) {
      this.worker.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      this.worker.postMessage(message, transfer)
    },
  }
}
