import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as SerializeError from '../SerializeError/SerializeError.js'

export const getErrorResponse = (message, error) => {
  if (error && error instanceof CommandNotFoundError) {
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
