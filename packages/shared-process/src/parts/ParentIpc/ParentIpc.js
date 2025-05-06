import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

// TODO add tests for this

// TODO handle structure: one shared process multiple extension hosts

// TODO pass socket / port handle also in electron

export const state = {
  electronPortMap: new Map(),
  rpc: undefined,
}

// TODO maybe rename to hydrate
export const listen = async () => {
  const method = IpcChildType.Auto()
  const rpc = await IpcChild.listen({
    method,
  })
  console.log({ rpc })
  state.rpc = rpc
}

export const invoke = (method, ...params) => {
  // @ts-ignore
  return state.rpc.invoke(method, ...params)
}
export const invokeAndTransfer = (method, ...params) => {
  // @ts-ignore
  return state.rpc.invokeAndTransfer(method, ...params)
}
