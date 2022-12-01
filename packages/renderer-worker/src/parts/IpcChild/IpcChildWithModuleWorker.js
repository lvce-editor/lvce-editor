export const listen = () => {
  if (typeof WorkerGlobalScope === 'undefined') {
    throw new Error('module is not in web worker scope')
  }
  const postMessageFn = globalThis.postMessage
  postMessageFn('ready')
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
