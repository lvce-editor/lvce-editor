import * as ExtensionNodeProcessIpc from '../ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const handleWebSocket = async (message: any, handle: any): Promise<void> => {
  const url = new URL(message.url, 'http://localhost')
  const extensionId = url.searchParams.get('extensionId')
  const rpcId = url.searchParams.get('rpcId')
  if (!extensionId || !rpcId) {
    throw new Error('Remote extension node process request is incomplete')
  }
  const ipc = await ExtensionNodeProcessIpc.create({
    extensionId,
    method: IpcParentType.NodeForkedProcess,
    rpcId,
  })
  try {
    await JsonRpc.invokeAndTransfer(ipc, 'NodeRpcProcess.handleWebSocket', handle, message)
  } catch (error) {
    ipc.dispose()
    throw error
  }
}
