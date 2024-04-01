import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcParentType.ModuleWorker:
      return import('../IpcParentWithModuleWorker/IpcParentWithModuleWorker.ts')
    case IpcParentType.MessagePort:
      return import('../IpcParentWithMessagePort/IpcParentWithMessagePort.ts')
    case IpcParentType.ReferencePort:
      return import('../IpcParentWithReferencePort/IpcParentWithReferencePort.ts')
    case IpcParentType.ModuleWorkerWithMessagePort:
      return import('../IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.ts')
    case IpcParentType.Electron:
      return import('../IpcParentWithElectron/IpcParentWithElectron.ts')
    default:
      throw new Error('unexpected ipc type')
  }
}
