import {
  ElectronMessagePortRpcClient,
  ElectronUtilityProcessRpcClient,
  NodeForkedProcessRpcClient,
  NodeWebSocketRpcClient,
  NodeWorkerRpcClient,
} from '@lvce-editor/rpc'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return NodeForkedProcessRpcClient
    case IpcChildType.NodeWorker:
      return NodeWorkerRpcClient
    case IpcChildType.ElectronUtilityProcess:
      return ElectronUtilityProcessRpcClient
    case IpcChildType.ElectronMessagePort:
      return ElectronMessagePortRpcClient
    case IpcChildType.NodeMessagePort:
      // deprecated
      return import('../IpcChildWithNodeMessagePort/IpcChildWithNodeMessagePort.js')
    case IpcChildType.WebSocket:
      return NodeWebSocketRpcClient
    default:
      throw new Error('unexpected ipc type')
  }
}
