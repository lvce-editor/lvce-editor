import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'

/**
 *
 * @param {WebSocket} webSocket
 * @returns
 */
export const waitForWebSocketToBeOpen = (webSocket) => {
  return GetFirstEvent.getFirstEvent(webSocket, {
    open: FirstWebSocketEventType.Open,
    close: FirstWebSocketEventType.Close,
    error: FirstWebSocketEventType.Error,
  })
}
