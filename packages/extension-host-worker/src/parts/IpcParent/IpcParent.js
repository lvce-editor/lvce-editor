import * as IpcParentType from '../IpcParentType/IpcParentType.js'

const getModule = (method) => {
  switch (method) {
    case IpcParentType.WebSocket:
      return import('./IpcParentWithWebSocket.js')
    default:
      throw new Error('unexpected ipc type')
  }
}

export const create = async ({ method, ...options }) => {
  const module = await getModule(method)
  return module.create(options)
}
