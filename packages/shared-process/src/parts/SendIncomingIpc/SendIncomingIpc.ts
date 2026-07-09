import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as IpcTransferState from '../IpcTransferState/IpcTransferState.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

const supportsPartialIpcHandling = (ipcId) => {
  switch (ipcId) {
    case IpcId.AuthProcess:
    case IpcId.TerminalProcess:
    case IpcId.ProcessExplorer:
    case IpcId.EmbedsProcess:
      return true
    default:
      return false
  }
}

// TODO fork ipc object instead of ref counting
// duplicated ipc object sends and receives one message
// original ipc object is never used and can
// be collected after being out of scope
// duplicated ipc can also be collected
// when it is out of scope

export const sendIncomingIpc = async (target, response, ipcId) => {
  if (!IpcTransferState.has(ipcId) && supportsPartialIpcHandling(ipcId)) {
    HandleIpc.handleIpc(target)
  }
  IpcTransferState.add(ipcId)
  await JsonRpc.invokeAndTransfer(target, response.method, ...response.params)
  IpcTransferState.remove(ipcId)
  if (!IpcTransferState.has(ipcId) && supportsPartialIpcHandling(ipcId)) {
    HandleIpc.unhandleIpc(target)
  }
}
