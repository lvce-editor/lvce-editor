const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

/**
 *
 * @param {import('electron').UtilityProcess} utilityProcess
 * @returns
 */
exports.getFirstUtilityProcessEvent = async (utilityProcess) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = (value) => {
      utilityProcess.off('exit', handleExit)
      utilityProcess.off('mesage', handleMessage)
      resolve(value)
    }
    const handleExit = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleMessage = (event) => {
      cleanup({ type: FirstNodeWorkerEventType.Message, event })
    }
    utilityProcess.on('exit', handleExit)
    utilityProcess.on('message', handleMessage)
  })
  return { type, event }
}
