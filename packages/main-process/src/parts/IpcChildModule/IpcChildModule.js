import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcChildWithRendererProcess from '../IpcChildWithRendererProcess/IpcChildWithRendererProcess.js'

export const getModule = (method) => {
  switch (method) {
    case IpcChildType.RendererProcess:
      return IpcChildWithRendererProcess
    default:
      throw new Error('unexpected ipc type')
  }
}
