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
exports.handlePort = async (event, data) => {
  const module = getModule(data)
  if (!module) {
    Logger.error(`[main-process] unexpected port type ${data}`)
    return
  }
  const port = event.ports[0]
  await module.handlePort(event, port, data)
}
