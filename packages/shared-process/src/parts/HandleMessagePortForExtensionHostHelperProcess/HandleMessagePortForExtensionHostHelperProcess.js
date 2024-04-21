import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

// TODO connect this ipc to the renderer worker ipc
// when renderer worker ipc closes, dispose all
// matching extension host helper processes
// unless the app is exiting, in which case the child processes
// would get cleaned up automatically
export const handleMessagePortForExtensionHostHelperProcess = (rendererWorkerIpc, port) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ExtensionHostHelperProcess, port, {})
}
