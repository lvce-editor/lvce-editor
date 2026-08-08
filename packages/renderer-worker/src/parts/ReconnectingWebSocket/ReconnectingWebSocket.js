export const create = (url, args) => {
  const webSocket = new WebSocket(url, args)
  const listeners = new Map()

  const reconnect = () => {
    const originalOnMessage = context.webSocket.onmessage
    context.webSocket = new WebSocket(url, args)
    context.webSocket.onmessage = originalOnMessage
    context.webSocket.onclose = handleClose
    for (const [type, typeListeners] of listeners) {
      for (const listener of typeListeners) {
        context.webSocket.addEventListener(type, listener)
      }
    }
  }

  const handleClose = () => {
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
      let typeListeners = listeners.get(type)
      if (!typeListeners) {
        typeListeners = new Set()
        listeners.set(type, typeListeners)
      }
      typeListeners.add(listener)
      this.webSocket.addEventListener(type, listener)
    },
    removeEventListener(type, listener) {
      const typeListeners = listeners.get(type)
      typeListeners?.delete(listener)
      if (typeListeners?.size === 0) {
        listeners.delete(type)
      }
      this.webSocket.removeEventListener(type, listener)
    },
  }

  webSocket.onclose = handleClose
  return context
}
