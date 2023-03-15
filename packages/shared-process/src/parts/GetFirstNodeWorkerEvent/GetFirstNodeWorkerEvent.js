import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

export const getFirstNodeWorkerEvent = async (worker) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.off('exit', handleExit)
      worker.off('error', handleError)
    }
    const handleExit = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleError = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Error, event })
    }
    worker.on('exit', handleExit)
    worker.on('error', handleError)
  })
  return { type, event }
}
