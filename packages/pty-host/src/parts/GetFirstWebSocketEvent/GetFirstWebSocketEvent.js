import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import { WebSocket } from 'ws'

export const getFirstWebSocketEvent = async (webSocket) => {
  switch (webSocket.readyState) {
    case WebSocket.OPEN:
      return {
        type: FirstWebSocketEventType.Open,
        event: undefined,
      }
    case WebSocket.CLOSED:
      return {
        type: FirstWebSocketEventType.Close,
        event: undefined,
      }
    default:
      break
  }
  const { type, event } = await new Promise((resolve) => {
    const cleanup = (value) => {
      webSocket.off('open', handleOpen)
      webSocket.off('close', handleClose)
      resolve(value)
    }
    const handleOpen = (event) => {
      cleanup({
        type: FirstWebSocketEventType.Open,
        event,
      })
    }
    const handleClose = (event) => {
      cleanup({
        type: FirstWebSocketEventType.Close,
        event,
      })
    }
    webSocket.on('open', handleOpen)
    webSocket.on('close', handleClose)
  })
  return { type, event }
}
