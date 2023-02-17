import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

export const getFirstNodeChildProcessEvent = async (childProcess) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = () => {
      childProcess.off('exit', handleExit)
      childProcess.off('error', handleError)
    }
    const handleMessage = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Message, event })
    }
    const handleExit = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleError = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Error, event })
    }
    childProcess.on('message', handleMessage)
    childProcess.on('exit', handleExit)
    childProcess.on('error', handleError)
  })
  return { type, event }
}
