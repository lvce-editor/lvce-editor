import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleMessagePortForFileSystemProcess = (port, ipcId) => {
  return HandleIncomingIpc.handleIncomingIpc(IpcId.FileSystemProcess, port, {
    ipcId,
  })
}
