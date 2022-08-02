import * as Command from '../Command/Command.js'

const JSON_RPC_VERSION = '2.0'

export const listen = (ipc) => {
  const handleMessage = async (event) => {
    const message = event.data
    if (message.method) {
      try {
        const result = await Command.execute(message.method, ...message.params)
        ipc.send({
          jsonrpc: JSON_RPC_VERSION,
          id: message.id,
          result,
        })
      } catch (error) {
        console.error(error)
        if (error && error instanceof Error && error.cause) {
          console.error(error.cause)
        }
        if (
          error &&
          error instanceof Error &&
          error.message &&
          error.message.startsWith('method not found')
        ) {
          ipc.send({
            jsonrpc: JSON_RPC_VERSION,
            id: message.id,
            error: {
              code: -32601,
              message: error.message,
              data: error.stack,
            },
          })
        } else {
          ipc.send({
            jsonrpc: JSON_RPC_VERSION,
            id: message.id,
            error,
          })
        }
      }
    }
  }
  ipc.onmessage = handleMessage
}
