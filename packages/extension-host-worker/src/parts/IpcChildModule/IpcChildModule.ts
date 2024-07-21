import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
// @ts-ignore
import { IpcChildWithModuleWorker, IpcChildWithModuleWorkerAndMessagePort, IpcChildWithMessagePort } from '/static/js/lvce-editor-ipc.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.ModuleWorker:
      return IpcChildWithModuleWorker
    case IpcChildType.ModuleWorkerWithMessagePort:
      return IpcChildWithModuleWorkerAndMessagePort
    case IpcChildType.MessagePort:
      return IpcChildWithMessagePort
    default:
      throw new Error('unexpected ipc type')
  }
}
