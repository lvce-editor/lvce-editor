import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state = {
  electronPortMap: new Map(),
  ipc: undefined,
}

// TODO maybe rename to hydrate
export const listen = async () => {
  const method = IpcChildType.Auto()
  const ipc = await IpcChild.listen({
    method,
  })
  HandleIpc.handleIpc(ipc)
  // @ts-ignore
  state.ipc = ipc
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
export const invokeAndTransfer = (method, ...params) => {
  return JsonRpc.invokeAndTransfer(state.ipc, method, ...params)
}
