import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'

export const getWebSocketUrl = (type, host) => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${host}/websocket/${type}`
}
