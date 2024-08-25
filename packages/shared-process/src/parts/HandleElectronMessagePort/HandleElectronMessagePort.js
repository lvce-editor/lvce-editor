import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as Assert from '../Assert/Assert.js'

export const handleElectronMessagePort = (messagePort, ipcId) => {
  Assert.object(messagePort)
  const message = {
    ipcId,
  }
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, messagePort, message)
}
