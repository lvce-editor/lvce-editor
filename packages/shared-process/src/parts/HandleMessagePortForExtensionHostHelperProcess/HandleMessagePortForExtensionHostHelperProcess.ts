import * as Assert from '../Assert/Assert.ts'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

// TODO connect this ipc to the renderer worker ipc
// when renderer worker ipc closes, dispose all
// matching extension host helper processes
// unless the app is exiting, in which case the child processes
// would get cleaned up automatically
export const handleMessagePortForExtensionHostHelperProcess = async (rendererWorkerIpc, port) => {
  Assert.object(port)
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.ElectronUtilityProcess,
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invokeAndTransfer(ipc, 'HandleElectronMessagePort.handleElectronMessagePort', port, IpcId.ExtensionHostWorker)
  // const cleanup = () => {
  //   ipc.dispose()
  //   rendererWorkerIpc.off('close', cleanup)
  // }
  // rendererWorkerIpc.on('close', cleanup)
}
