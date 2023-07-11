import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.js'

export const waitForProcessToExit = async (childProcess) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = (value) => {
      childProcess.off('close', handleClose)
      childProcess.off('error', handleError)
      resolve(value)
    }
    const handleClose = (event) => {
      cleanup({
        type: ProcessExitEventType.Exit,
        event,
      })
    }
    const handleError = (event) => {
      cleanup({
        type: ProcessExitEventType.Error,
        event,
      })
    }
    childProcess.on('close', handleClose)
    childProcess.on('error', handleError)
  })
  return {
    type,
    event,
  }
}
