const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

const getFirstNodeWorkerEvent = async (ipc) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = () => {
      ipc.off('exit', handleExit)
      ipc.off('error', handleError)
    }
    const handleExit = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleError = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Error, event })
    }
    ipc.on('exit', handleExit)
    ipc.on('error', handleError)
  })
  return { type, event }
}

exports.getFirstNodeWorkerEvent = getFirstNodeWorkerEvent
