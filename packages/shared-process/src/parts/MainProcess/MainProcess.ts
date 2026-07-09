import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state: any = {
  electronPortMap: new Map(),
  ipc: undefined,
}

// TODO maybe rename to hydrate
export const listen = async (): Promise<any> => {
  const method = IpcChildType.Auto()
  const ipc = await IpcChild.listen({
    method,
  })
  HandleIpc.handleIpc(ipc)
  // @ts-ignore
  state.ipc = ipc
}

export const invoke = (method: any, ...params: any): any => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
export const invokeAndTransfer = (method: any, ...params: any): any => {
  return JsonRpc.invokeAndTransfer(state.ipc, method, ...params)
}
