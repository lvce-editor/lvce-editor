import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleWebSocket = (request: any, handle: any): any => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, handle, request)
}
