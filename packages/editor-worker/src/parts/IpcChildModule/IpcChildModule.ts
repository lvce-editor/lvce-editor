import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

// @ts-ignore
export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.ts')
    case IpcChildType.ModuleWorker:
      return import('../IpcChildWithModuleWorker/IpcChildWithModuleWorker.ts')
    case IpcChildType.ReferencePort:
      return import('../IpcChildWithReferencePort/IpcChildWithReferencePort.ts')
    case IpcChildType.ModuleWorkerAndMessagePort:
      return import('../IpcChildWithModuleWorkerAndMessagePort/IpcChildWithModuleWorkerAndMessagePort.ts')
    default:
      throw new Error('unexpected ipc type')
  }
}
