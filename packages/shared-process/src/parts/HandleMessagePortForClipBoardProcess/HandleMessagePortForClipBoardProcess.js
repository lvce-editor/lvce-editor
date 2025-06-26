import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForClipBoardProcess = (port, ipcId) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ClipBoardProcess, port, {
    ipcId,
  })
}
