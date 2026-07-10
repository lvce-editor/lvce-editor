import * as Assert from '../Assert/Assert.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForTerminalProcess = (port: any): any => {
  Assert.object(port)
  return HandleIncomingIpc.handleIncomingIpc(IpcId.TerminalProcess, port, {})
}
