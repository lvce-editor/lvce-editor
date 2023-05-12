import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.NodeForkedProcess:
      return import('../IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js')
    case IpcChildType.NodeWorker:
      return import('../IpcChildWithNodeWorker/IpcChildWithNodeWorker.js')
    case IpcChildType.ElectronUtilityProcess:
      return import('../IpcChildWithElectronUtilityProcess/IpcChildWithElectronUtilityProcess.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
