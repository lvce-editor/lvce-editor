import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const getResponse = async (message) => {
  try {
    const result = await Command.invoke(message.method, ...message.params)
    return {
      jsonrpc: JsonRpc.Version,
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
        jsonrpc: JsonRpc.Version,
        id: message.id,
        error: {
          code: JsonRpc.ErrorMethodNotFound,
          message: error.message,
          data: error.stack,
        },
      }
    }
    return {
      jsonrpc: JsonRpc.Version,
      id: message.id,
      error,
    }
  }
}
export const listen = (ipc) => {
  const handleMessage = async (message) => {
    if ('method' in message) {
      const response = await getResponse(message)
      console.log({ response })
      ipc.send(response)
    }
  }
  ipc.on('message', handleMessage)
}
