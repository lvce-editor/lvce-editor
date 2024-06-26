import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.ts'

export const listen = async () => {
  const postMessageFn = globalThis.postMessage
  postMessageFn('ready')
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(globalThis)
  if (firstMessage.method !== 'initialize') {
    throw new Error('unexpected first message')
  }
  const type = firstMessage.params[0]
  if (type === 'message-port') {
    postMessageFn({
      jsonrpc: '2.0',
      id: firstMessage.id,
      result: null,
    })
    const port = firstMessage.params[1]
    return port
  }
  return globalThis
}

export const wrap = (global) => {
  return {
    global,
    send(message) {
      this.global.postMessage(message)
    },
    sendAndTransfer(message, transferables) {
      this.global.postMessage(message, transferables)
    },
    get onmessage() {
      return this.global.onmessage
    },
    set onmessage(listener) {
      this.global.onmessage = listener
    },
  }
}
