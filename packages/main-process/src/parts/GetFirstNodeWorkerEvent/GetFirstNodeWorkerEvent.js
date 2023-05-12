const { Worker } = require('worker_threads')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

/**
 *
 * @param {Worker} worker
 * @returns
 */
const getFirstNodeWorkerEvent = async (worker) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = (value) => {
      worker.off('message', handleMessage)
      worker.off('exit', handleExit)
      worker.off('error', handleError)
      resolve(value)
    }
    const handleMessage = (event) => {
      cleanup({
        type: FirstNodeWorkerEventType.Message,
        event,
      })
    }
    const handleExit = (event) => {
      cleanup({
        ype: FirstNodeWorkerEventType.Exit,
        event,
      })
    }
    const handleError = (event) => {
      cleanup({
        type: FirstNodeWorkerEventType.Error,
        event,
      })
    }
    worker.on('message', handleMessage)
    worker.on('exit', handleExit)
    worker.on('error', handleError)
  })
  return { type, event }
}

exports.getFirstNodeWorkerEvent = getFirstNodeWorkerEvent
