import * as Callback from '../Callback/Callback.js'

const getPort = () => {
  return new Promise((resolve, reject) => {
    const id = Callback.register(resolve, reject)
    const message = {
      jsonrpc: '2.0',
      method: 'ElectronMessagePort.create',
      params: [],
      id,
    }
    postMessage(message)
  })
}

export const create = async () => {
  const port = await getPort()
  let handleMessage
  return {
    get onmessage() {
      return handleMessage
    },
    set onmessage(listener) {
      let handleMessage
      if (listener) {
        handleMessage = (event) => {
          listener(event.data)
        }
      } else {
        handleMessage = null
      }
      port.onmessage = handleMessage
    },
    send(message) {
      port.postMessage(message)
    },
  }
}
