import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleWebSocket = (request, handle) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, handle, request)
}
