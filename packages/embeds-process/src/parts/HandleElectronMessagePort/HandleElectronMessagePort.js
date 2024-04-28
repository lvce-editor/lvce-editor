import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as HandleIpcClosed from '../HandleIpcClosed/HandleIpcClosed.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as IpcId from '../IpcId/IpcId.js'
import * as ParentIpc from '../ParentIpc/ParentIpc.js'
import * as SharedProcessIpc from '../SharedProcessIpc/SharedProcessIpc.js'

export const handleElectronMessagePort = async (messagePort, ipcId) => {
  Assert.object(messagePort)
  // TODO use handleIncomingIpc function
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
  if (ipcId === IpcId.MainProcess) {
    ParentIpc.state.ipc = ipc
  } else if (ipcId === IpcId.SharedProcess) {
    SharedProcessIpc.state.ipc = ipc
  } else if (ipcId === IpcId.EmbedsWorker) {
    ipc.addEventListener('close', HandleIpcClosed.handleIpcClosed)
  }
}
