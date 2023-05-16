import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return import('../IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js')
    case IpcChildType.NodeWorker:
      return import('../IpcChildWithNodeWorker/IpcChildWithNodeWorker.js')
    case IpcChildType.WebSocket:
      return import('../IpcChildWithWebSocket/IpcChildWithWebSocket.js')
    case IpcChildType.ElectronUtilityProcess:
      return import('../IpcChildWithElectronUtilityProcess/IpcChildWithElectronUtilityProcess.js')
    case IpcChildType.ElectronMessagePort:
      return import('../IpcChildWithElectronMessagePort/IpcChildWithElectronMessagePort.js')
    case IpcChildType.NodeMessagePort:
      return import('../IpcChildWithNodeMessagePort/IpcChildWithNodeMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
