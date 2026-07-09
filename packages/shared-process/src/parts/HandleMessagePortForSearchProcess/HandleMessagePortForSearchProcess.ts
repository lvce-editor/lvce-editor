import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForSearchProcess = (port) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SearchProcess, port, {})
}
