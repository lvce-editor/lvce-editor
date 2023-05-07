import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.js')
    case IpcChildType.ModuleWorkerAndMessagePort:
      return import('../IpcChildWithModuleWorkerAndMessagePort/IpcChildWithModuleWorkerAndMessagePort.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
