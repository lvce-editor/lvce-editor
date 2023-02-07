const getFirstMessage = () => {
  return new Promise((resolve) => {
    globalThis.onmessage = (event) => {
      globalThis.onmessage = null
      resolve(event.data)
    }
  })
}

export const listen = async () => {
  const postMessageFn = globalThis.postMessage
  postMessageFn('ready')
  const firstMessage = await getFirstMessage()
  if (firstMessage.method !== 'initialize') {
    throw new Error('unexpected first message')
  }
  const type = firstMessage.params[0]
  if (type === 'message-port') {
    const port = firstMessage.params[1]
    return {
      send(message) {
        port.postMessage(message)
      },
      sendAndTransfer(message, transferables) {
        port.postMessage(message, transferables)
      },
      get onmessage() {
        return port.onmessage
      },
      set onmessage(listener) {
        port.onmessage = listener
      },
    }
  }
  return {
    send(message) {
      postMessageFn(message)
    },
    sendAndTransfer(message, transferables) {
      postMessageFn(message, transferables)
    },
    get onmessage() {
      return onmessage
    },
    set onmessage(listener) {
      onmessage = listener
    },
  }
}
