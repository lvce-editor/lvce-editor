import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleElectronMessagePort = (messagePort, ...params) => {
  const ipcId = params[0]
  const windowId = params[1]
  const message = {
    ipcId,
    windowId,
  }
  return HandleIncomingIpc.handleIncomingIpc(IpcId.SharedProcess, messagePort, message)
}
