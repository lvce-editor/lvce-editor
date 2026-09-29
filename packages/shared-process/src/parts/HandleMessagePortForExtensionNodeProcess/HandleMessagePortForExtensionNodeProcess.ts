import * as Assert from '../Assert/Assert.ts'
import * as ExtensionNodeProcessIpc from '../ExtensionNodeProcessIpc/ExtensionNodeProcessIpc.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const handleMessagePortForExtensionNodeProcess = async (
  rendererWorkerIpc: any,
  port: any,
  extensionId: string,
  rpcId: string,
): Promise<void> => {
  Assert.object(port)
  Assert.string(extensionId)
  Assert.string(rpcId)
  const ipc = await ExtensionNodeProcessIpc.create({
    extensionId,
    method: IpcParentType.ElectronUtilityProcess,
    rpcId,
  })
  const dispose = (): void => {
    ipc.dispose()
  }
  const removeRendererCloseListener = (): void => {
    rendererWorkerIpc.removeEventListener('close', dispose)
  }
  rendererWorkerIpc.addEventListener('close', dispose)
  ipc.on('close', removeRendererCloseListener)
  try {
    await JsonRpc.invokeAndTransfer(ipc, 'NodeRpcProcess.handleElectronMessagePort', port)
  } catch (error) {
    removeRendererCloseListener()
    ipc.dispose()
    throw error
  }
}
