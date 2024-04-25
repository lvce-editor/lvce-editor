import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleElectronMessagePort = (messagePort, ipcId) => {
  const message = {
    ipcId,
  }
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, messagePort, message)
}
