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
  console.log({ rendererWorkerIpc })
  Assert.object(port)
  const ipc = await ExtensionHostHelperProcessIpc.create({
    method: IpcParentType.ElectronUtilityProcess,
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
  // if (rendererWorkerIpc.isDisposed) {
  //   ipc.dispose()
  // } else {
  //   const handleDispose = () => {
  //     rendererWorkerIpc.off('dispose', handleDispose)
  //   }
  //   rendererWorkerIpc.on('dispose', handleDispose)
  // }
  rendererWorkerIpc.messagePort.on('close', () => {
    console.log('port closed')
  })
}
