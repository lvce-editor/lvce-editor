import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForClipBoardProcess = (port, ipcId) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ClipBoardProcess, port, {
    ipcId,
  })
}
