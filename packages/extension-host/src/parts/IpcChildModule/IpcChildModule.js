import * as Assert from '../Assert/Assert.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  Assert.number(method)
  switch (method) {
    case IpcChildType.WebSocket:
      return import('../IpcChildWithWebSocket/IpcChildWithWebSocket.js')
    case IpcChildType.Worker:
      return import('../IpcChildWithWorker/IpcChildWithWorker.js')
    case IpcChildType.ChildProcess:
      return import('../IpcChildWithChildProcess/IpcChildWithChildProcess.js')
    default:
      throw new Error(`unexpected ipc type ${method}`)
  }
}
