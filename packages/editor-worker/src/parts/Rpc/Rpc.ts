import * as IpcState from '../IpcState/IpcState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const send = (method: string, ...params: any[]) => {
  const ipc = IpcState.get()
  JsonRpc.send(ipc, method, ...params)
}

export const invoke = (method: string, ...params: any[]) => {
  const ipc = IpcState.get()
  return JsonRpc.invoke(ipc, method, ...params)
}

export const invokeAndTransfer = async (transfer: any, method: string, ...params: any[]) => {
  const ipc = IpcState.get()
  return JsonRpc.invokeAndTransfer(ipc, transfer, method, ...params)
}

export const listen = (ipc: any) => {
  IpcState.set(ipc)
}
