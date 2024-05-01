import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForSearchProcess = (port) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SearchProcess, port, {})
}
