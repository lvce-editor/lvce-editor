import {
  ElectronMessagePortRpcClient,
  ElectronUtilityProcessRpcClient,
  NodeForkedProcessRpcClient,
  NodeWebSocketRpcClient,
  NodeWorkerRpcClient,
} from '@lvce-editor/rpc'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const getModule = (method: number) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return NodeForkedProcessRpcClient.create
    case IpcChildType.NodeWorker:
      return NodeWorkerRpcClient.create
    case IpcChildType.ElectronUtilityProcess:
      return ElectronUtilityProcessRpcClient.create
    case IpcChildType.ElectronMessagePort:
      return ElectronMessagePortRpcClient.create
    case IpcChildType.WebSocket:
      return NodeWebSocketRpcClient.create
    default:
      throw new Error('unexpected ipc type')
  }
}
