export const listen = () => {
  const channel = new MessageChannel()
  const { port1, port2 } = channel
  postMessage(
    {
      jsonrpc: '2.0',
      method: 'ready',
      params: [port1],
    },
    [port1]
  )
  return {
    send(message) {
      port2.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      port2.postMessage(message, transferables)
    },
    get onmessage() {
      return port2.onmessage
    },
    set onmessage(listener) {
      port2.onmessage = listener
    },
  }
}
