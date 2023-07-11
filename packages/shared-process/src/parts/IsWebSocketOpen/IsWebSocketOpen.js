import { WebSocket } from 'ws'

export const isWebSocketOpen = (webSocket) => {
  return webSocket.readyState === WebSocket.OPEN
}
