import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as SerializeError from '../SerializeError/SerializeError.js'

export const getErrorResponse = (message, error) => {
  const serializedError = SerializeError.serializeError(error)
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    error: {
      message: serializedError.message,
      stack: serializedError.stack,
      name: serializedError.name,
      type: serializedError.type,
    },
  }
}
