import { IpcParentWithNodeForkedProcess, IpcParentWithNodeWorker } from '@lvce-editor/ipc'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'

export const getModule = (method: any): any => {
  switch (method) {
    case IpcParentType.ElectronUtilityProcess:
      return import('../IpcParentWithElectronUtilityProcess/IpcParentWithElectronUtilityProcess.ts')
    case IpcParentType.NodeForkedProcess:
      return IpcParentWithNodeForkedProcess
    case IpcParentType.NodeWorker:
      return IpcParentWithNodeWorker
    default:
      throw new Error('unexpected ipc type')
  }
}
