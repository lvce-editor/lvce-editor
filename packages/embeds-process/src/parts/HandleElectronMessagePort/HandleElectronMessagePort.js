import * as Assert from '../Assert/Assert.js'
import * as HandleIncomingIpc from '../HandleIncomingIpc/HandleIncomingIpc.js'

export const handleElectronMessagePort = async (messagePort, ipcId) => {
  Assert.object(messagePort)
  Assert.number(ipcId)
  return HandleIncomingIpc.handleIncomingIpc(ipcId, messagePort, {})
  // const ipc = await IpcChild.listen({
  //   method: IpcChildType.ElectronMessagePort,
  //   messagePort,
  // })
  // HandleIpc.handleIpc(ipc)
  // if (ipcId === IpcId.MainProcess) {
  //   ParentIpc.state.ipc = ipc
  // } else if (ipcId === IpcId.SharedProcess) {
  //   SharedProcessIpc.state.ipc = ipc
  // } else if (ipcId === IpcId.EmbedsWorker) {
  //   ipc.addEventListener('close', HandleIpcClosed.handleIpcClosed)
  // }
}
