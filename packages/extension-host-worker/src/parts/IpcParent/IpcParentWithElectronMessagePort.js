import * as Callback from '../Callback/Callback.js'

const getPort = () => {
  const { id, promise } = Callback.registerPromise()
  const message = {
    jsonrpc: '2.0',
    method: 'ElectronMessagePort.create',
    params: [],
    id,
  }
  postMessage(message)
  return promise
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
