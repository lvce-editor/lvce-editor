import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForTerminalProcess = (port) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.TerminalProcess, port, {})
}
