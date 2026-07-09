import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as Assert from '../Assert/Assert.ts'

export const handleElectronMessagePort = (messagePort, ipcId) => {
  Assert.object(messagePort)
  const message = {
    ipcId,
  }
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, messagePort, message)
}
