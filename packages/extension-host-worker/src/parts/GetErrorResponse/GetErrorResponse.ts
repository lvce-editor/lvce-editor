import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.ts'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.ts'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'
import * as SerializeError from '../SerializeError/SerializeError.ts'

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
      codeFrame: serializedError.codeFrame,
      message: serializedError.message,
      stack: serializedError.stack,
      name: serializedError.name,
      type: serializedError.type,
    },
  }
}
