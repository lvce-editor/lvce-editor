import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'

export const getWebSocketUrl = (type) => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${location.host}/websocket/${type}`
}
