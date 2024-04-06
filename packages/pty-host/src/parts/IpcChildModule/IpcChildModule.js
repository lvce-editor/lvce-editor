import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import { IpcChildWithElectronUtilityProcess, IpcChildWithWebSocket, IpcChildWithElectronMessagePort } from '@lvce-editor/ipc'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return import('../IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js')
    case IpcChildType.NodeWorker:
      return import('../IpcChildWithNodeWorker/IpcChildWithNodeWorker.js')
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    case IpcChildType.ElectronMessagePort:
      return IpcChildWithElectronMessagePort
    case IpcChildType.NodeMessagePort:
      return import('../IpcChildWithNodeMessagePort/IpcChildWithNodeMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
