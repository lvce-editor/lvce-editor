import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.js')
<<<<<<< HEAD
    case IpcChildType.ModuleWorkerAndMessagePort:
      return import('../IpcChildWithModuleWorkerAndMessagePort/IpcChildWithModuleWorkerAndMessagePort.js')
=======
    case IpcChildType.ModuleWorker:
      return import('../IpcChildWithModuleWorker/IpcChildWithModuleWorker.js')
    case IpcChildType.ReferencePort:
      return import('../IpcChildWithReferencePort/IpcChildWithReferencePort.js')
>>>>>>> origin/main
    default:
      throw new Error('unexpected ipc type')
  }
}
