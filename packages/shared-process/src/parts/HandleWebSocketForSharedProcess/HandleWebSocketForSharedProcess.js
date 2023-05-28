import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as HandleSocketError from '../HandleSocketError/HandleSocketError.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'

export const handleWebSocket = async (message, handle) => {
  handle.on('error', HandleSocketError.handleSocketError)
  const webSocket = await WebSocketServer.handleUpgrade(message, handle)
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    webSocket,
  })
  HandleIpc.handleIpc(ipc)
}
