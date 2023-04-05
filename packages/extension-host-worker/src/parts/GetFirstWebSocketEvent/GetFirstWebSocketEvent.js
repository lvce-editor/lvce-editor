import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'

/**
 *
 * @param {WebSocket} webSocket
 * @returns
 */
export const waitForWebSocketToBeOpen = async (webSocket) => {
  const { type, event } = await new Promise((resolve) => {
    const cleanup = (value) => {
      webSocket.onopen = null
      webSocket.onerror = null
      webSocket.onclose = null
      resolve(value)
    }
    const handleOpen = (event) => {
      cleanup({ type: FirstWebSocketEventType.Open, event })
    }
    const handleError = (event) => {
      cleanup({ type: FirstWebSocketEventType.Error, event })
    }
    const handleClose = (event) => {
      cleanup({
        type: FirstWebSocketEventType.Close,
        event,
      })
    }
    webSocket.onopen = handleOpen
    webSocket.onerror = handleError
    webSocket.onclose = handleClose
  })
  return {
    type,
    event,
  }
}
