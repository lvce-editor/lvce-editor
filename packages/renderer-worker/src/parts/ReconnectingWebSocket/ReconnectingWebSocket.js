export const create = (url, args, getConnectionInfo) => {
  const webSocket = new WebSocket(url, args)
  const listeners = new Map()
  let closed = false

  const scheduleReconnect = () => {
    if (!closed) {
      setTimeout(() => void reconnect(), 2000)
    }
  }

  const reconnect = async () => {
    if (closed) {
      return
    }
    try {
      const originalOnMessage = context.webSocket.onmessage
      const connectionInfo = getConnectionInfo ? await getConnectionInfo() : { args, url }
      context.webSocket = new WebSocket(connectionInfo.url, connectionInfo.protocols || connectionInfo.args)
      context.webSocket.onmessage = originalOnMessage
      context.webSocket.onclose = handleClose
      for (const [type, typeListeners] of listeners) {
        for (const listener of typeListeners) {
          context.webSocket.addEventListener(type, listener)
        }
      }
    } catch {
      scheduleReconnect()
    }
  }

  const handleClose = () => {
    scheduleReconnect()
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
    close() {
      closed = true
      this.webSocket.close()
    },
  }

  webSocket.onclose = handleClose
  return context
}
