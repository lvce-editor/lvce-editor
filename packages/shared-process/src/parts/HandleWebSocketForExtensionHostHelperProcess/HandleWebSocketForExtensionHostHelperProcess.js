import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const handleWebSocket = async (message, handle) => {
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.NodeForkedProcess,
  })
  await JsonRpc.invokeAndTransfer(ipc, handle, 'HandleWebSocket.handleWebSocket', message)
}
