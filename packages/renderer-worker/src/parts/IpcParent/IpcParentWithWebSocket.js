const getWsUrl = () => {
  const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:'

  return `${wsProtocol}//${location.host}`
}

export const create = ({ protocol }) => {
  debugger
  // TODO replace this during build
  const wsUrl = getWsUrl()
  const webSocket = new WebSocket(wsUrl, [protocol])
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
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = JSON.parse(event.data)
            listener(message)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      webSocket.onmessage = handleMessage
    },
    send(message) {
      pendingMessages.push(message)
    },
  }
  return ipc
}
