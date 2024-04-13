import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import {
  IpcChildWithElectronUtilityProcess,
  IpcChildWithWebSocket,
  IpcChildWithNodeWorker,
  IpcChildWithNodeForkedProcess,
  IpcChildWithElectronMessagePort,
} from '@lvce-editor/ipc'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return IpcChildWithNodeForkedProcess
    case IpcChildType.NodeWorker:
      return IpcChildWithNodeWorker
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    case IpcChildType.ElectronMessagePort:
      return IpcChildWithElectronMessagePort
    case IpcChildType.NodeMessagePort:
      return import('../IpcChildWithNodeMessagePort/IpcChildWithNodeMessagePort.js')
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    default:
      throw new Error('unexpected ipc type')
  }
}
