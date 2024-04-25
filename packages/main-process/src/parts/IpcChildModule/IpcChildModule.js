import {
  IpcChildWithElectronMessagePort,
  IpcChildWithElectronUtilityProcess,
  IpcChildWithNodeForkedProcess,
  IpcChildWithNodeWorker,
  IpcChildWithWebSocket,
  IpcChildWithRendererProcess2,
} from '@lvce-editor/ipc'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return IpcChildWithNodeForkedProcess
    case IpcChildType.NodeWorker:
      return IpcChildWithNodeWorker
    case IpcChildType.WebSocket:
      return IpcChildWithWebSocket
    case IpcChildType.ElectronUtilityProcess:
      return IpcChildWithElectronUtilityProcess
    case IpcChildType.ElectronMessagePort:
      return IpcChildWithElectronMessagePort
    case IpcChildType.RendererProcess2:
      return IpcChildWithRendererProcess2
    default:
      throw new Error('unexpected ipc type')
  }
}
