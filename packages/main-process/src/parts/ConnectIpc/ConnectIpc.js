import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getModule = (method) => {
  switch (method) {
    case IpcParentType.NodeWorker:
      return import('../ConnectIpcNodeWorker/ConnectIpcNodeWorker.js')
    case IpcParentType.ElectronUtilityProcess:
      return import('../ConnectIpcElectronUtilityProcess/ConnectIpcElectronUtilityProcess.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const connectIpc = async (method, ipc, browserWindowPort, ipcId) => {
  const module = await getModule(method)
  return module.connectIpc(ipc, browserWindowPort, ipcId)
}
