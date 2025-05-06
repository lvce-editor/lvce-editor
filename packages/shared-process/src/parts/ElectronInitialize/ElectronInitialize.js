import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const electronInitialize = async (port, folder) => {
  await IpcChild.listen({
    method: IpcChildType.NodeMessagePort,
    messagePort: port,
  })
}
