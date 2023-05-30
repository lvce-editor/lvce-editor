import { WebSocket } from 'ws'

export const isWebSocket = (value) => {
  return value instanceof WebSocket
}
