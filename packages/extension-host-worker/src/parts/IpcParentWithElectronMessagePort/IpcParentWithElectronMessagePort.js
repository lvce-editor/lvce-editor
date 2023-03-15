import * as Callback from '../Callback/Callback.js'
import * as Rpc from '../Rpc/Rpc.js'

const getPort = async () => {
  const { id, promise } = Callback.registerPromise()
  const message = {
    jsonrpc: '2.0',
    method: 'ElectronMessagePort.create',
    params: [],
    id,
  }
  Rpc.state.ipc.send(message)
  const response = await promise
  const port = response.result
  return port
}

export const create = async () => {
  const port = await getPort()
  return port
}

export const wrap = (port) => {
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
