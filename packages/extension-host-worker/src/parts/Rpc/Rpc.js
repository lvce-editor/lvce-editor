import * as Command from '../Command/Command.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'

export const listen = (ipc) => {
  const handleMessage = async (event) => {
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
        if (
          error &&
          error instanceof Error &&
          error.message &&
          error.message.startsWith('method not found')
        ) {
          ipc.send({
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: JsonRpcErrorCode.MethodNotFound,
              message: error.message,
              data: error.stack,
            },
          })
        } else {
          ipc.send({
            jsonrpc: '2.0',
            id: message.id,
            error,
          })
        }
      }
    }
  }
  ipc.onmessage = handleMessage
}
