import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

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
