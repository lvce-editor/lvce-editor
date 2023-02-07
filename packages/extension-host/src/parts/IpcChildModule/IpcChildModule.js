import * as Assert from '../Assert/Assert.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const getModule = (method) => {
  Assert.number(method)
  switch (method) {
    case IpcChildType.WebSocket:
      return import('../IpcChild/IpcChildWithWebSocket.js')
    case IpcChildType.Worker:
      return import('../IpcChild/IpcChildWithWorker.js')
    case IpcChildType.ChildProcess:
      return import('../IpcChild/IpcChildWithChildProcess.js')
    default:
      throw new Error(`unexpected ipc type ${method}`)
  }
}
