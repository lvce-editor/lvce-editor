import * as Callback from '../Callback/Callback.js'

const handleMessage = (message) => {
  if ('result' in message) {
    Callback.resolve(message.id, message.result)
  } else if ('error' in message) {
    Callback.reject(message.id, message.error)
  } else {
    console.log({ message })
  }
}

export const listen = async (ipc) => {
  ipc.onmessage = handleMessage
  return {
    invoke(method, params) {
      return new Promise((resolve, reject) => {
        const id = Callback.register(resolve, reject)
        ipc.send({
          jsonrpc: '2.0',
          method,
          id,
          params,
        })
      })
    },
  }
}
