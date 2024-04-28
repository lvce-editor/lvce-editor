import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as EmbedsProcessState from '../EmbedsProcessState/EmbedsProcessState.js'

export const handleMessagePortForEmbedsProcess = (port, ipcId) => {
  EmbedsProcessState.increment()
  return HandleIncomingIpc.handleIncomingIpc(IpcId.EmbedsProcess, port, {
    ipcId,
  })
}
