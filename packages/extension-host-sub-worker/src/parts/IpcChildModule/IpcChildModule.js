import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('../IpcChildWithMessagePort/IpcChildWithMessagePort.js')
    case IpcChildType.ModuleWorker:
      return import('../IpcChildWithModuleWorker/IpcChildWithModuleWorker.js')
    default:
      throw new Error('unexpected ipc type')
  }
}
