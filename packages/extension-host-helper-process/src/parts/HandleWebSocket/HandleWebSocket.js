import * as Assert from '../Assert/Assert.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleWebSocket = async (handle, request) => {
  Assert.object(handle)
  Assert.object(request)
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    request,
    handle,
  })
  HandleIpc.handleIpc(ipc)
}
