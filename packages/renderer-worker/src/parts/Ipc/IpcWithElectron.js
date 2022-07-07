export const listen = () => {
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
  const handleMessage = (event) => {
    const port = event.ports[0]
    ipc.send = (message) => {
      port.postMessage(message)
    }
    port.onmessage = (event) => {
      const message = event.data
      if (ipc._listener) {
        // @ts-ignore
        ipc._listener(message)
      }
    }
    for (const pendingMessage of ipc.pendingMessages) {
      ipc.send(pendingMessage)
    }
    // port.start()
  }
  if (
    // @ts-ignore
    typeof window !== 'undefined' &&
    // @ts-ignore
    window.myApi &&
    // @ts-ignore
    window.myApi.ipcConnect &&
    // @ts-ignore
    typeof window.myApi.ipcConnect === 'function'
  ) {
    // @ts-ignore
    window.addEventListener('message', handleMessage, { once: true })
    // @ts-ignore
    window.myApi.ipcConnect()
  } else {
    console.warn('api is not available')
  }
}
