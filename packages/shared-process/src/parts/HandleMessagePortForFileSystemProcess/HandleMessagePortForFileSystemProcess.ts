import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleMessagePortForFileSystemProcess = (port, ipcId) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.FileSystemProcess, port, {
    ipcId,
  })
}
