import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as Socket from '../Socket/Socket.js'
import * as WebSocketServer from '../WebSocketServer/WebSocketServer.js'

const handleSocketError = (error) => {
  if (error && error.code === ErrorCodes.ECONNRESET) {
    return
  }
  console.info('[info shared process: handle error]', error)
}

export const handleWebSocket = async (message, handle) => {
  handle.on('error', handleSocketError)
  const webSocket = await WebSocketServer.handleUpgrade(message, handle)
  Socket.set(webSocket)
}
