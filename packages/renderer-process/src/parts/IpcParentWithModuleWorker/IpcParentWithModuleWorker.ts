import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.ts'
import * as GetFirstWorkerEvent from '../GetFirstWorkerEvent/GetFirstWorkerEvent.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsErrorEvent from '../IsErrorEvent/IsErrorEvent.ts'
import { WorkerError } from '../WorkerError/WorkerError.js'
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
      if (IsErrorEvent.isErrorEvent(event)) {
        throw new WorkerError(event)
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
