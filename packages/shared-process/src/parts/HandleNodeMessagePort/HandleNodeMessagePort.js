import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleNodeMessagePort = async (messagePort) => {
  console.log('got message port', messagePort)
  const ipc = await IpcChild.listen({
    method: IpcChildType.NodeMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
  messagePort.start()
}
