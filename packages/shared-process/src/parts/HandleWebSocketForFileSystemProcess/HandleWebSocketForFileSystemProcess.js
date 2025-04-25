import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleWebSocket = (message, handle) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.FileSystemProcess, handle, message)
}
