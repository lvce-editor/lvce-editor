import * as Assert from '../Assert/Assert.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForProcessExplorer = (port) => {
  Assert.object(port)
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ProcessExplorer, port, {})
}
