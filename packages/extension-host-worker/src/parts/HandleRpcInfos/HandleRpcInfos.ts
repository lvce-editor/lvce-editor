import * as ExtensionHostRpcState from '../ExtensionHostRpcState/ExtensionHostRpcState.ts'

export const handleRpcInfos = (rpcs) => {
  try {
    if (!rpcs) {
      return
    }
    if (!Array.isArray(rpcs)) {
      return
    }

    for (const rpc of rpcs) {
      ExtensionHostRpcState.add(rpc.id, rpc)
    }
  } catch (error) {
    console.warn(`Failed to handle extension rpcs: ${error}`)
  }
}
