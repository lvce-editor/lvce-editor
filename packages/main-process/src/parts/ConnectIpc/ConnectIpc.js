const IpcParentType = require('../IpcParentType/IpcParentType.js')

const getModule = (method) => {
  switch (method) {
    case IpcParentType.NodeWorker:
      return require('../ConnectIpcNodeWorker/ConnectIpcNodeWorker.js')
    case IpcParentType.ElectronUtilityProcess:
      return require('../ConnectIpcElectronUtilityProcess/ConnectIpcElectronUtilityProcess.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

exports.connectIpc = async (method, ipc, browserWindowPort, folder) => {
  const module = getModule(method)
  return module.connectIpc(ipc, browserWindowPort, folder)
}
