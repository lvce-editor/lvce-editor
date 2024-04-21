import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForEmbedsProcess = (port) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.EmbedsProcess, port, {})
}
