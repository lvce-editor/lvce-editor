import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleNodeMessagePort = async (messagePort) => {
  await IpcChild.listen({
    method: IpcChildType.NodeMessagePort,
    messagePort,
  })
}
