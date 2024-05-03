import * as Assert from '../Assert/Assert.js'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleElectronMessagePort = async (messagePort, ipcId) => {
  Assert.object(messagePort)
  // TODO use ipcId parameter
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, messagePort, {})
}
