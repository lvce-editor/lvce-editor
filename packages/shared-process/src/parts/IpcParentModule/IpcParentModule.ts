import { IpcParentWithNodeForkedProcess, IpcParentWithNodeWorker } from '@lvce-editor/ipc'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const getModule = (method: any): any => {
  switch (method) {
    case IpcParentType.NodeWorker:
      return IpcParentWithNodeWorker
    case IpcParentType.NodeForkedProcess:
      return IpcParentWithNodeForkedProcess
    case IpcParentType.ElectronUtilityProcess:
      return import('../IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.ts')
    default:
      throw new Error('unexpected ipc type')
  }
}
