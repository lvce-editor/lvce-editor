import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as Logger from '../Logger/Logger.js'
import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'

const handleSocketError = (error) => {
  if (error && error.code === ErrorCodes.ECONNRESET) {
    return
  }
  Logger.info('[info shared process: handle error]', error)
}

export const handleWebSocket = async (message, handle) => {
  handle.on('error', handleSocketError)
  const webSocket = await WebSocketServer.handleUpgrade(message, handle)
  const ipc = await IpcChild.listen({
    method: IpcChildType.WebSocket,
    webSocket,
  })
  HandleIpc.handleIpc(ipc)
}
