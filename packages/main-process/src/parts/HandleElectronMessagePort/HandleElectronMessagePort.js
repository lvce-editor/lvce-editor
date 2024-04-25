import * as Assert from '../Assert/Assert.js'
import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcId from '../IpcId/IpcId.js'

export const handleElectronMessagePort = async (messagePort, ipcId) => {
  Assert.object(messagePort)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
  if (ipcId === IpcId.EmbedsProcess) {
    EmbedsProcess.set(ipc)
  }
}
