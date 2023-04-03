import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.js'

export const getFirstWorkerEvent = async (worker) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = (value) => {
      worker.onmessage = null
      worker.onerror = null
      resolve(value)
    }
    const handleFirstMessage = (event) => {
      cleanup({ type: FirstWorkerEventType.Message, event })
    }
    const handleFirstError = (event) => {
      cleanup({ type: FirstWorkerEventType.Error, event })
    }
    worker.onmessage = handleFirstMessage
    worker.onerror = handleFirstError
  })
  return { type, event }
}
