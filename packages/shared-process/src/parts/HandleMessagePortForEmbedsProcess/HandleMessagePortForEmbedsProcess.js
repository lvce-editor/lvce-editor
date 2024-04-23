import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForEmbedsProcess = (port, ipcId) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.EmbedsProcess, port, {
    ipcId,
  })
}
