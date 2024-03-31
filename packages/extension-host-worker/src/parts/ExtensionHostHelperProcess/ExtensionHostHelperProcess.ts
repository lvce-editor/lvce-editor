import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.ts'
import * as ExtensionHostHelperProcessIpcType from '../ExtensionHostHelperProcessIpcType/ExtensionHostHelperProcessIpcType.ts'
import * as ExtensionHostHelperProcessRpc from '../ExtensionHostHelperProcessRpc/ExtensionHostHelperProcessRpc.ts'

export const state = {
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

const createRpc = async () => {
  const type = ExtensionHostHelperProcessIpcType.getIpcType()
  const ipc = await ExtensionHostHelperProcessIpc.create(type)
  const rpc = ExtensionHostHelperProcessRpc.listen(ipc)
  return rpc
}

export const getOrCreateRpc = () => {
  if (!state.rpcPromise) {
    // @ts-ignore
    state.rpcPromise = createRpc()
  }
  return state.rpcPromise
}

export const invoke = async (method, ...params) => {
  const rpc = await getOrCreateRpc()
  // @ts-ignore
  return rpc.invoke(method, params)
}
