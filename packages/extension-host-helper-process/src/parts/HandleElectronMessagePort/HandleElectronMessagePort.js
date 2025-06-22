import * as Assert from '../Assert/Assert.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as HandleIpcClosed from '../HandleIpcClosed/HandleIpcClosed.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleElectronMessagePort = async (messagePort) => {
  // TODO make it so when messageport closes, the process exits
  Assert.object(messagePort)
  const rpc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  // @ts-ignore
  rpc.ipc.addEventListener('close', HandleIpcClosed.handleIpcClosed)
}
