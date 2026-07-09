import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleWebSocket = (request, handle) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, handle, request)
}
