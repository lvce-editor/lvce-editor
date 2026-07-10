import {
  IpcChildWithElectronMessagePort,
  IpcChildWithElectronUtilityProcess,
  IpcChildWithNodeForkedProcess,
  IpcChildWithNodeWorker,
  IpcChildWithWebSocket,
} from '@lvce-editor/ipc'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const getModule = (method: any): any => {
  switch (method) {
    case IpcChildType.ElectronMessagePort:
      return IpcChildWithElectronMessagePort
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    case IpcChildType.NodeForkedProcess:
      return IpcChildWithNodeForkedProcess
    case IpcChildType.NodeMessagePort:
      return import('../IpcChildWithNodeMessagePort/IpcChildWithNodeMessagePort.ts')
    case IpcChildType.NodeWorker:
      return IpcChildWithNodeWorker
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    default:
      throw new Error('unexpected ipc type')
  }
}
