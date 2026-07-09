import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as Assert from '../Assert/Assert.ts'

export const handleMessagePortForTerminalProcess = (port) => {
  Assert.object(port)
  return HandleIncomingIpc.handleIncomingIpc(IpcId.TerminalProcess, port, {})
}
