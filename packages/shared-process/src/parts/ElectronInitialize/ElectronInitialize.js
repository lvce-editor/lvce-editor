import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const electronInitialize = async (port, folder) => {
  const ipc = await IpcChild.listen({
    method: IpcChildType.NodeMessagePort,
    messagePort: port,
  })
  HandleIpc.handleIpc(ipc)
}
