import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as ResolveExtensionNodeRpcPath from '../ResolveExtensionNodeRpcPath/ResolveExtensionNodeRpcPath.ts'

export const handleWebSocket = async (message: any, handle: any): Promise<any> => {
  const url = new URL(message.url, 'http://localhost')
  const extensionId = url.searchParams.get('extensionId')
  const rpcId = url.searchParams.get('rpcId')
  if (!extensionId && !rpcId) {
    return HandleIncomingIpc.handleIncomingIpc(IpcId.ExtensionHostHelperProcess, handle, message)
  }
  if (!extensionId || !rpcId) {
    throw new Error('Remote extension node rpc request is incomplete')
  }
  const modulePath = await ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath(extensionId, rpcId)
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.NodeForkedProcess,
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'LoadFile.loadFile', modulePath)
    await JsonRpc.invokeAndTransfer(ipc, 'HandleWebSocket.handleWebSocket', handle, message)
  } catch (error) {
    ipc.dispose()
    throw error
  }
}
