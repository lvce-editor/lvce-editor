import { IpcParentWithNodeForkedProcess, IpcParentWithNodeWorker } from '@lvce-editor/ipc'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.NodeWorker:
      return IpcParentWithNodeWorker
    case IpcParentType.NodeForkedProcess:
      return IpcParentWithNodeForkedProcess
    case IpcParentType.ElectronUtilityProcess:
      return import('../IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.js')
    default:
      throw new Error(`unexpected ipc type ${method}`)
  }
}
