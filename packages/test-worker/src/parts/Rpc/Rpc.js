import * as IpcState from '../IpcState/IpcState.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const send = (method, ...params) => {
  const ipc = IpcState.get()
  JsonRpc.send(ipc, method, ...params)
}

export const invoke = (method, ...params) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const listen = (ipc) => {
  IpcState.set(ipc)
}
