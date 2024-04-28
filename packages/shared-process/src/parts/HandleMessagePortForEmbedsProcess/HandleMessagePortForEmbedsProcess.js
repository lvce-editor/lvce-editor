import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as EmbedProcessState from '../EmbedProcessState/EmbedProcessState.js'

export const handleMessagePortForEmbedsProcess = (port, ipcId) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.EmbedsProcess, port, {
    ipcId,
  })
}
