import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'
import * as WebSocketReadyState from '../WebSocketReadyState/WebSocketReadyState.js'

export const getFirstWebSocketEvent = async (webSocket) => {
  switch (webSocket.readyState) {
    case WebSocketReadyState.Open:
      return {
        type: FirstWebSocketEventType.Open,
        event: undefined,
      }
    case WebSocketReadyState.Closed:
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
