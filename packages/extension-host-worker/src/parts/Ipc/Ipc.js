import * as Command from '../Command/Command.js'

const getIpc = () => {
  postMessage('ready')
  return {
    get onmessage() {
      return onmessage
    },
    set onmessage(listener) {
      onmessage = listener
    },
    send(message) {
      postMessage(message)
    },
  }
}

export const listen = () => {
  const ipc = getIpc()
  const handleMessage = async (event) => {
    console.log({ event })
    const message = event.data
    if (message.method) {
      try {
        const result = await Command.execute(message.method, ...message.params)
        ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          result,
        })
      } catch (error) {
        console.error(error)
        if (error && error.cause) {
          console.error(error.cause)
        }
        ipc.send({
          jsonrpc: '2.0',
          id: message.id,
          error,
        })
      }
    }
  }
  ipc.onmessage = handleMessage
}
