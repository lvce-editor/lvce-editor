import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleWebSocket = async (request, handle) => {
  Assert.object(request)
  Assert.object(handle)
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    request,
    handle,
  })
  HandleIpc.handleIpc(ipc)
}
