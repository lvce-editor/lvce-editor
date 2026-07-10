import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const electronInitialize = async (port: any, folder: any): Promise<any> => {
  const ipc = await IpcChild.listen({
    messagePort: port,
    method: IpcChildType.NodeMessagePort,
  })
  HandleIpc.handleIpc(ipc)
}
