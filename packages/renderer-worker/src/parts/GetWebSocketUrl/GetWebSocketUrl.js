import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.js'

export const getWsUrl = (type) => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${location.host}?type=${type}`
}
