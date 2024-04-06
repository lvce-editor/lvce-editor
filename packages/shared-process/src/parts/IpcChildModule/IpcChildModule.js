import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import { IpcChildWithElectronUtilityProcess, IpcChildWithWebSocket } from '@lvce-editor/ipc'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return import('../IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js')
    case IpcChildType.NodeWorker:
      return import('../IpcChildWithNodeWorker/IpcChildWithNodeWorker.js')
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    case IpcChildType.ElectronMessagePort:
      return import('../IpcChildWithElectronMessagePort/IpcChildWithElectronMessagePort.js')
    case IpcChildType.NodeMessagePort:
      return import('../IpcChildWithNodeMessagePort/IpcChildWithNodeMessagePort.js')
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    default:
      throw new Error('unexpected ipc type')
  }
}
