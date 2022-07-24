import VError from 'verror'

export const Methods = {
  WebSocket: 1,
  ChildProcess: 2,
  Worker: 3,
}

const getModule = (method) => {
  switch (method) {
    case Methods.WebSocket:
      return import('./IpcWithWebSocket.js')
    case Methods.ChildProcess:
      return import('./IpcWithChildProcess.js')
    case Methods.Worker:
      return import('./IpcWithWorker.js')
    default:
      throw new VError('unexpected ipc type')
  }
}

export const listen = async (method) => {
  const module = await getModule(method)
  return module.listen(process)
}
