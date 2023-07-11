import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'

export const getWsUrl = () => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${location.host}`
}
