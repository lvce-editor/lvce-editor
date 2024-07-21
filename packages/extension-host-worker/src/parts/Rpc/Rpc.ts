import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcState from '../IpcState/IpcState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const send = (method, ...params) => {
  const ipc = IpcState.get()
  JsonRpc.send(ipc, method, ...params)
}

export const invoke = (method, ...params) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = (transfer, method, ...params) => {
  const ipc = IpcState.get()
  return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}

export const listen = (ipc) => {
  HandleIpc.handleIpc(ipc)
  IpcState.set(ipc)
}
