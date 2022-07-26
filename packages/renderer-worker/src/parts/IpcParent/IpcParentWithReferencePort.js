export const create = async ({ url }) => {
  const referencePort = await new Promise((resolve) => {
    globalThis.acceptReferencePort = resolve
    import(url)
  })
  delete globalThis.acceptReferencePort
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            const message = event.data
            listener(message)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      referencePort.onmessage = handleMessage
    },
    send(message) {
      referencePort.postMessage(message)
    },
  }
}
