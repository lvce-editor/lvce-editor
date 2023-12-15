import { WebSocket } from 'ws'
import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

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
  const { type, event } = await GetFirstEvent.getFirstEvent(webSocket, {
    open: FirstWebSocketEventType.Open,
    close: FirstWebSocketEventType.Close,
  })
  return { type, event }
}
