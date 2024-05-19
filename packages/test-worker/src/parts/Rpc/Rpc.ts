import * as IpcState from '../IpcState/IpcState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'


export const invoke = (method, ...params) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const listen = (ipc) => {
  IpcState.set(ipc)
}
