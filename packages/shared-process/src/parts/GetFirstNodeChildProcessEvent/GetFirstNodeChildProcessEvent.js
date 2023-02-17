import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

export const getFirstNodeChildProcessEvent = async (childProcess) => {
  const { type, event, stdout, stderr } = await new Promise((resolve, reject) => {
    let stderr = ''
    let stdout = ''
    const cleanup = () => {
      childProcess.stderr.off('data', handleStdErrData)
      childProcess.stdout.off('data', handleStdoutData)
      childProcess.off('message', handleMessage)
      childProcess.off('exit', handleExit)
      childProcess.off('error', handleError)
    }
    const handleStdErrData = (data) => {
      stderr += data
    }
    const handleStdoutData = (data) => {
      stdout += data
    }
    const handleMessage = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Message, event, stdout, stderr })
    }
    const handleExit = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Exit, event, stdout, stderr })
    }
    const handleError = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Error, event, stdout, stderr })
    }
    childProcess.stderr.on('data', handleStdErrData)
    childProcess.stdout.on('data', handleStdoutData)
    childProcess.on('message', handleMessage)
    childProcess.on('exit', handleExit)
    childProcess.on('error', handleError)
  })
  return { type, event, stdout, stderr }
}
