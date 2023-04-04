const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

/**
 *
 * @param {import('electron').UtilityProcess} utilityProcess
 * @returns
 */
exports.getFirstUtilityProcessEvent = async (utilityProcess) => {
  const { type, event, stdout, stderr } = await new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    const cleanup = (value) => {
      // @ts-ignore
      utilityProcess.stderr.off('data', handleStdErrData)
      // @ts-ignore
      utilityProcess.stdout.off('data', handleStdoutData)
      utilityProcess.off('message', handleMessage)
      utilityProcess.off('exit', handleExit)
      resolve(value)
    }
    const handleStdErrData = (data) => {
      stderr += data
    }
    const handleStdoutData = (data) => {
      stdout += data
    }
    const handleMessage = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Message, event, stdout, stderr })
    }
    const handleExit = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Exit, event, stdout, stderr })
    }
    // @ts-ignore
    utilityProcess.stderr.on('data', handleStdErrData)
    // @ts-ignore
    utilityProcess.stdout.on('data', handleStdoutData)
    utilityProcess.on('message', handleMessage)
    utilityProcess.on('exit', handleExit)
  })
  return { type, event, stdout, stderr }
}
