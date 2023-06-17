import * as FirstWebSocketEventType from '../FirstWebSocketEventType/FirstWebSocketEventType.js'

export const waitForWebSocketToBeOpen = async (webSocket) => {
  const { type, event } = await new Promise((resolve) => {
    const cleanup = (value) => {
      webSocket.onopen = null
      webSocket.onclose = null
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
    webSocket.onopen = handleOpen
    webSocket.onclose = handleClose
  })
  return {
    type,
    event,
  }
}
