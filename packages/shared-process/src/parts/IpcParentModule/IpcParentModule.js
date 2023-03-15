import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.NodeWorker:
      return import('../IpcParentWithNodeWorker/IpcParentWithNodeWorker.js')
    case IpcParentType.NodeForkedProcess:
      return import('../IpcParentWithNodeForkedProcess/IpcParentWithNodeForkedProcess.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
