export const waitForWebSocketToBeOpen = (webSocket) => {
  return new Promise((resolve) => {
    webSocket.onopen = () => {
      webSocket.onopen = null
      resolve(undefined)
    }
  })
}
