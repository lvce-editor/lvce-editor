import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
// @ts-ignore
import { IpcChildWithModuleWorker, IpcChildWithModuleWorkerAndMessagePort, IpcChildWithMessagePort } from '/static/js/lvce-editor-ipc.js'

export const getModule = (method: any) => {
  switch (method) {
    case IpcChildType.ModuleWorker:
      return IpcChildWithModuleWorker
    case IpcChildType.ModuleWorkerAndMessagePort:
      return IpcChildWithModuleWorkerAndMessagePort
    case IpcChildType.MessagePort:
      return IpcChildWithMessagePort
    default:
      throw new Error('unexpected ipc type')
  }
}
