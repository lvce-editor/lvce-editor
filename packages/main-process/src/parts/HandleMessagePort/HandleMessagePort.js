const Logger = require('../Logger/Logger.js')
const ErrorHandling = require('../ErrorHandling/ErrorHandling.js')
const { MessageChannelMain } = require('electron')
const Assert = require('../Assert/Assert.js')

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
  sender.openDevTools()
  const id = message.id
  const data = message.params[0]
  try {
    const module = getModule(data)
    if (!module) {
      Logger.error(`[main-process] unexpected port type ${data}`)
      return
    }
    const channel = new MessageChannelMain()
    const { port1, port2 } = channel
    await module.handlePort(event, port1)
    sender.postMessage(
      'port',
      {
        jsonrpc: '2.0',
        id,
        result: null,
      },
      [port2]
    )
  } catch (error) {
    // TODO send jsonrpc error message
    await ErrorHandling.handleError(error)
  }
}
