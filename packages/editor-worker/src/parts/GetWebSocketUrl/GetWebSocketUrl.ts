import * as WebSocketProtocol from '../WebSocketProtocol/WebSocketProtocol.ts'

// @ts-ignore
export const getWsUrl = (type) => {
  const wsProtocol = WebSocketProtocol.getWebSocketProtocol()
  return `${wsProtocol}//${location.host}?type=${type}`
}
