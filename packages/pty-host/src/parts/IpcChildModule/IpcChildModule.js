import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return import('../IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js')
    case IpcChildType.NodeWorker:
      return import('../IpcChildWithNodeWorker/IpcChildWithNodeWorker.js')
    case IpcChildType.WebSocket:
      return import('../IpcChildWithWebSocket/IpcChildWithWebSocket.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
