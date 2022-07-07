import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const listen = async () => {
  const ipc = {
    _pendingMessages: [],
    _listener: undefined,
    send(message) {},
    get onmessage() {
      return this._listener
    },
    set onmessage(listener) {
      this._listener = listener
    },
  }

  const originalOnMessage = onmessage
  const port = await new Promise((resolve, reject) => {
    onmessage = (event) => {
      const port = event.ports[0]
      resolve(port)
    }
  })

  console.log({ port })
  onmessage = originalOnMessage

  let handleMessage

  return {
    send(message) {
      port.postMessage(message)
    },
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      if (listener) {
        handleMessage = (event) => {
          // TODO why are some events not instance of message event?
          if (event instanceof MessageEvent) {
            listener(event.data)
          } else {
            listener(event)
          }
        }
      } else {
        handleMessage = null
      }
      port.onmessage = handleMessage
    },
  }
}
