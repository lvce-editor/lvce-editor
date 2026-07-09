import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForClipBoardProcess = (port: any, ipcId: any): any => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.ClipBoardProcess, port, {
    ipcId,
  })
}
