import * as IpcChildType from '../IpcChildType/IpcChildType.js'
// @ts-ignore
import { IpcChildWithModuleWorker } from '/static/js/lvce-editor-ipc.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.ModuleWorker:
      return IpcChildWithModuleWorker
    default:
      throw new Error('unexpected ipc type')
  }
}
