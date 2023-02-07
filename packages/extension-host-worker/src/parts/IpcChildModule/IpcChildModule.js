import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChild/IpcChildWithMessagePort.js')
    case IpcChildType.ModuleWorker:
      return import('../IpcChild/IpcChildWithModuleWorker.js')
    case IpcChildType.ReferencePort:
      return import('../IpcChild/IpcChildWithReferencePort.js')
    case IpcChildType.ModuleWorkerWithMessagePort:
      return import('../IpcChild/IpcChildWithModuleWorkerAndMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
