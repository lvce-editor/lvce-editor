const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')

/**
 *
 * @param {import('electron').UtilityProcess} utilityProcess
 * @returns
 */
exports.getFirstUtilityProcessEvent = async (utilityProcess) => {
  const { type, event } = await new Promise((resolve, reject) => {
    const cleanup = () => {
      utilityProcess.off('exit', handleExit)
      utilityProcess.off('mesage', handleMessage)
    }
    const handleExit = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Exit, event })
    }
    const handleMessage = (event) => {
      cleanup()
      resolve({ type: FirstNodeWorkerEventType.Message, event })
    }
    utilityProcess.on('exit', handleExit)
    utilityProcess.on('message', handleMessage)
  })
  return { type, event }
}
