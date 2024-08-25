import * as Assert from '../Assert/Assert.js'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForProcessExplorer = (port) => {
  Assert.object(port)
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ProcessExplorer, port, {})
}
