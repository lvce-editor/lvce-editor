import * as Rpc from '../Rpc/Rpc.ts'

export const invoke = async (method: string, ...params: any[]) => {
  return Rpc.invoke(method, ...params)
}

export const invokeAndTransfer = async (transfer: any, method: string, ...params: any[]) => {
  return Rpc.invokeAndTransfer(transfer, method, ...params)
}
