export const create = (url, baton) => {
  const webSocket = new WebSocket(url)
  const state = {
    webSocket,
    pendingMessages: [],
  }
  baton.send = (message) => {
    state.pendingMessages.push(message)
  }
  baton.dispose = () => {
    webSocket.close()
  }
  webSocket.onopen = () => {
    baton.send = (message) => {
      webSocket.send(stringifiedMessage)
    }
    for (const message of state.pendingMessages) {
      baton.send(message)
    }
    state.pendingMessages = []
  }
  webSocket.onmessage = ({ data }) => {
    const message = JSON.parse(data)
    baton.receive(message)
  }
  return {
    get onmessage() {
      return webSocket.onmessage
    },
    set onmessage(listener) {
      webSocket.onmessage = (event) => {
        const parsed = JSON.parse(event.data)
        listener(parsed)
      }
    },
    send(message) {
      const stringifiedMessage = JSON.stringify(message)
      webSocket.send(stringifiedMessage)
    },
  }
}
