import * as IpcChildType from '../IpcChildType/IpcChildType.js'

const getModule = (method) => {
  switch (method) {
    case IpcChildType.MessagePort:
      return import('./IpcChildWithMessagePort.js')
    case IpcChildType.WebSocket:
      return import('./IpcChildWithWebSocket.js')
    case IpcChildType.Parent:
      return import('./IpcChildWithParent.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const listen = async ({ method }) => {
  const module = await getModule(method)
  return module.listen()
}
