const createContext = (webSocket, createWebSocket) => {
  const listeners = new Map()

  const scheduleReconnect = () => {
    setTimeout(() => void reconnect(), 2000)
  }

  const reconnect = async () => {
    try {
      const originalOnMessage = context.webSocket.onmessage
      context.webSocket = await createWebSocket()
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
  }

  webSocket.onclose = handleClose
  return context
}

export const create = (url, args) => {
  return createContext(new WebSocket(url, args), () => new WebSocket(url, args))
}

export const createWithUrlFactory = async (getUrl, args) => {
  const createWebSocket = async () => new WebSocket(await getUrl(), args)
  return createContext(await createWebSocket(), createWebSocket)
}
