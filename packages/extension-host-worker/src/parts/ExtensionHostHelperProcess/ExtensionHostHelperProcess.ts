import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as ExtensionHostHelperProcessIpcType from '../ExtensionHostHelperProcessIpcType/ExtensionHostHelperProcessIpcType.js'
import * as ExtensionHostHelperProcessRpc from '../ExtensionHostHelperProcessRpc/ExtensionHostHelperProcessRpc.js'

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
    state.rpcPromise = createRpc()
  }
  return state.rpcPromise
}

export const invoke = async (method, ...params) => {
  const rpc = await getOrCreateRpc()
  return rpc.invoke(method, params)
}
