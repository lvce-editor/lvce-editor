import * as Assert from '../Assert/Assert.js'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as HandleIpcClosed from '../HandleIpcClosed/HandleIpcClosed.js'

export const handleWebSocket = async (handle, request) => {
  // TODO make it so when websocket closes, the process exits
  Assert.object(handle)
  Assert.object(request)
  handle.on('close', HandleIpcClosed.handleIpcClosed)
  await IpcChild.listen({
    commandMap: CommandMapRef.commandMapRef,
    method: IpcChildType.WebSocket,
    request,
    handle,
  })
}
