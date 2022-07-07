export const listen = () => {
  // TODO replace this during build
  const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${wsProtocol}//${location.host}`
  const webSocket = new WebSocket(wsUrl)
  const pendingMessages = []
  webSocket.onopen = () => {
    ipc.send = (message) => {
      const stringifiedMessage = JSON.stringify(message)
      webSocket.send(stringifiedMessage)
    }
    for (const message of pendingMessages) {
      ipc.send(message)
    }
    pendingMessages.length = 0
  }
  let handleMessage
  const ipc = {
    send(message) {
      pendingMessages.push(message)
    },
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          console.log({ event })
          if (event instanceof MessageEvent) {
            const message = JSON.parse(event.data)
            listener(message)
          } else {
            console.log({ event })
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      webSocket.onmessage = handleMessage
    },
  }
  return ipc
}
