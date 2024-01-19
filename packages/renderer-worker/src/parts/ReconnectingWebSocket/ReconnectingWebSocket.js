export const create = (url, args) => {
  const webSocket = new WebSocket(url, args)

  const reconnect = () => {
    const originalOnMessage = context.webSocket.onmessage
    context.webSocket = new WebSocket(url, args)
    context.webSocket.onmessage = originalOnMessage
    context.webSocket.onclose = handleClose
  }

  const handleClose = (event) => {
    setTimeout(reconnect, 2000)
  }

  const context = {
    webSocket,
    get onmessage() {
      return this.webSocket.onmessage
    },
    set onmessage(value) {
      this.webSocket.onmessage = value
    },
    send(message) {
      this.webSocket.send(message)
    },
    addEventListener(type, listener) {
      this.webSocket.addEventListener(type, listener)
    },
    removeEventListener(type, listener) {
      this.webSocket.removeEventListener(type, listener)
    },
  }

  webSocket.onclose = handleClose
  return context
}
