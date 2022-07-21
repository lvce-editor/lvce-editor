import VError from 'verror'
import * as IpcWithChildProcess from '../Ipc/IpcWithChildProcess.js'
import * as IpcWithWorker from '../Ipc/IpcWithWorker.js'
import * as IpcWithWebSocket from '../Ipc/IpcWithWebSocket.js'

export const Methods = {
  WebSocket: 1,
  ChildProcess: 2,
  Worker: 3,
}

export const listen = async (method) => {
  switch (method) {
    case Methods.WebSocket:
      return IpcWithWebSocket.listen(process)
    case Methods.ChildProcess:
      return IpcWithChildProcess.listen()
    case Methods.Worker:
      return IpcWithWorker.listen()
    default:
      throw new VError('unexpected ipc type')
  }
}
