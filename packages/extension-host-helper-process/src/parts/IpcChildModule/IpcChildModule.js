import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.js')
    case IpcChildType.WebSocket:
      return import('../IpcChildWithWebSocket/IpcChildWithWebSocket.js')
    case IpcChildType.Parent:
      return import('../IpcChildWithParent/IpcChildWithParent.js')
    case IpcChildType.NodeForkedProcess:
      return import('../IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js')
    case IpcChildType.ElectronMessagePort:
      return import('../IpcChildWithElectronMessagePort/IpcChildWithElectronMessagePort.js')
    case IpcChildType.ElectronUtilityProcess:
      return import('../IpcChildWithElectronUtilityProcess/IpcChildWithElectronUtilityProcess.js')
    case IpcChildType.ElectronUtilityProcessMessagePort:
      return import('../IpcChildWithElectronUtilityProcessMessagePort/IpcChildWithElectronUtilityProcessMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
