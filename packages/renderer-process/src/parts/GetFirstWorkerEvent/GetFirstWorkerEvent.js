import * as FirstWorkerEventType from '../FirstWorkerEventType/FirstWorkerEventType.js'

export const getFirstWorkerEvent = async (worker) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.onmessage = null
      worker.onerror = null
    }
    const handleFirstMessage = (event) => {
      cleanup()
      resolve({ type: FirstWorkerEventType.Message, event })
    }
    const handleFirstError = (event) => {
      cleanup()
      resolve({ type: FirstWorkerEventType.Error, event })
    }
    worker.onmessage = handleFirstMessage
    worker.onerror = handleFirstError
  })
  return { type, event }
}
