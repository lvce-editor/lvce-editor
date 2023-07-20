import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.js'

export const waitForWebSocketToBeOpen = (webSocket) => {
  return GetFirstEvent.getFirstEvent(webSocket, {
    open: FirstWebSocketEventType.Open,
    close: FirstWebSocketEventType.Close,
  })
}
