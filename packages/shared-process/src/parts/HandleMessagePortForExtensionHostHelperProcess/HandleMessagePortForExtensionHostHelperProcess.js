import * as Assert from '../Assert/Assert.js'
import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

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
  await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
  const cleanup = () => {
    ipc.dispose()
    rendererWorkerIpc.off('close', cleanup)
  }
  rendererWorkerIpc.on('close', cleanup)
}
