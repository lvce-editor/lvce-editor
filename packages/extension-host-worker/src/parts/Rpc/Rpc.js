import * as Command from '../Command/Command.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

const getResponse = async (message) => {
  try {
    const result = await Command.execute(message.method, ...message.params)
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      result,
    }
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message &&
      error.message.startsWith('method not found')
    ) {
      return {
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        error: {
          code: JsonRpcErrorCode.MethodNotFound,
          message: error.message,
          data: error.stack,
        },
      }
    }
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      error,
    }
  }
}

export const listen = (ipc) => {
  const handleMessage = async (event) => {
    const message = event.data
    if (message.method) {
      const response = await getResponse(message)
      ipc.send(response)
    }
  }
  ipc.onmessage = handleMessage
}
