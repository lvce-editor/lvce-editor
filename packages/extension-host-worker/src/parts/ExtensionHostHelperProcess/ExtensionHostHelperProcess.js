import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as ExtensionHostHelperProcessIpcType from '../ExtensionHostHelperProcessIpcType/ExtensionHostHelperProcessIpcType.js'
import * as ExtensionHostHelperProcessRpc from '../ExtensionHostHelperProcessRpc/ExtensionHostHelperProcessRpc.js'

export const state = {
  /**
   * @type {any}
   */
  rpcPromise: undefined,
}

export const getOrCreateRpc = () => {
  if (!state.rpcPromise) {
    const type = ExtensionHostHelperProcessIpcType.getIpcType()
    state.rpcPromise = ExtensionHostHelperProcessIpc.create(type).then(
      ExtensionHostHelperProcessRpc.listen
    )
  }
  return state.rpcPromise
}

export const invoke = async (method, ...params) => {
  const rpc = await getOrCreateRpc()
  return rpc.invoke(method, params)
}
