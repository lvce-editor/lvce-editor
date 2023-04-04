const { MessageChannelMain } = require('electron')
const Assert = require('../Assert/Assert.js')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.js')
const GetErrorResponse = require('../GetErrorResponse/GetErrorResponse.js')
const GetSuccessResponse = require('../GetSuccessResponse/GetSuccessResponse.js')
const Logger = require('../Logger/Logger.js')

const getModule = (type) => {
  switch (type) {
    case 'shared-process':
      return require('../HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js')
    case 'extension-host':
      return require('../HandleMessagePortForExtensionHost/HandleMessagePortForExtensionHost.js')
    case 'electron-process':
      return require('../HandleMessagePortForMainProcess/HandleMessagePortForMainProcess.js')
    case 'quickpick':
      return require('../HandleMessagePortForQuickPick/HandleMessagePortForQuickPick.js')
    case 'extension-host-helper-process':
      return require('../HandleMessagePortForExtensionHostHelperProcess/HandleMessagePortForExtensionHostHelperProcess.js')
    default:
      if (type.startsWith('custom:')) {
        return require('../HandleMessagePortForCustom/HandleMessagePortForCustom.js')
      }
      return undefined
  }
}

/**
 * @param {import('electron').IpcMainEvent} event
 */
exports.handlePort = async (event, message) => {
  Assert.object(event)
  Assert.object(message)
  const sender = event.sender
  const data = message.params[0]
  try {
    const module = getModule(data)
    if (!module) {
      Logger.error(`[main-process] unexpected port type ${data}`)
      return
    }
    const channel = new MessageChannelMain()
    const { port1, port2 } = channel
    await module.handlePort(event, port1, data)
    const response = GetSuccessResponse.getSuccessResponse(message, null)
    sender.postMessage('port', response, [port2])
  } catch (error) {
    await ErrorHandling.handleError(error)
    const response = GetErrorResponse.getErrorResponse(message, error)
    sender.postMessage('port', response)
  }
}
