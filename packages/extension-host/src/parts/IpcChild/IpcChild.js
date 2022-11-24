import * as Assert from '../Assert/Assert.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

const getModule = (method) => {
  Assert.number(method)
  switch (method) {
    case IpcChildType.WebSocket:
      return import('./IpcChildWithWebSocket.js')
    case IpcChildType.Worker:
      return import('./IpcChildWithWorker.js')
    case IpcChildType.ChildProcess:
      return import('./IpcChildWithChildProcess.js')
    default:
      throw new Error(`unexpected ipc type ${method}`)
  }
}

export const listen = async ({ method }) => {
  const module = await getModule(method)
  return module.listen()
}
