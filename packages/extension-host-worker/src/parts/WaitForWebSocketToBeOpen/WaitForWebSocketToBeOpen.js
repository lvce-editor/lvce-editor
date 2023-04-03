export const waitForWebSocketToBeOpen = async (webSocket) => {
  const value = await new Promise((resolve) => {
    const cleanup = (value) => {
      webSocket.onopen = null
      resolve(value)
    }
    const handleOpen = () => {
      cleanup(undefined)
    }
    webSocket.onopen = handleOpen
  })
  return value
}
