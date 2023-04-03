import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

export const getFirstNodeWorkerEvent = async (worker) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = (value) => {
      worker.off('exit', handleExit)
      worker.off('error', handleError)
      resolve(value)
    }
    const handleExit = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleError = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Error, event })
    }
    worker.on('exit', handleExit)
    worker.on('error', handleError)
  })
  return { type, event }
}
