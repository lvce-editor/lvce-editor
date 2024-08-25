import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as Assert from '../Assert/Assert.js'

export const handleMessagePortForTerminalProcess = (port) => {
  Assert.object(port)
  return HandleIncomingIpc.handleIncomingIpc(IpcId.TerminalProcess, port, {})
}
