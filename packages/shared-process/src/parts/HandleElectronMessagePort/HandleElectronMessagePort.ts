import * as Assert from '../Assert/Assert.ts'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.ts'
import * as IpcId from '../IpcId/IpcId.ts'

export const handleElectronMessagePort = (messagePort: any, ipcId: any): any => {
  Assert.object(messagePort)
  const message = {
    ipcId,
  }
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, messagePort, message)
}
