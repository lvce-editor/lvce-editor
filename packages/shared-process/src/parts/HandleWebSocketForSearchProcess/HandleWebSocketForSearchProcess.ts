import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleWebSocket = (message: any, handle: any): any => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SearchProcess, handle, message)
}
