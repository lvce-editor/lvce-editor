import type { WebSocketCapability } from '../WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.ts'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const handleWebSocket = async (message: any, handle: any, type: string, capability: WebSocketCapability): Promise<void> => {
  if (!capability.modulePath) {
    throw new Error('extension helper capability is missing a module path')
  }
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.NodeForkedProcess,
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'LoadFile.loadFile', capability.modulePath)
    await JsonRpc.invokeAndTransfer(ipc, 'HandleWebSocket.handleWebSocket', handle, message)
  } catch (error) {
    ipc.dispose()
    throw error
  }
}
