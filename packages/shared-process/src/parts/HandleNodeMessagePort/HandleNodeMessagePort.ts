import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const handleNodeMessagePort = async (messagePort) => {
  const ipc = await IpcChild.listen({
    method: IpcChildType.NodeMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
}
