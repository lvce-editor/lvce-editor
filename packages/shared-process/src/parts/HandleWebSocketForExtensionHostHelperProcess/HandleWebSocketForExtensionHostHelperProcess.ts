import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleWebSocket = (message, handle) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ExtensionHostHelperProcess, handle, message)
}
