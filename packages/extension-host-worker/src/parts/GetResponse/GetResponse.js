import * as Command from '../Command/Command.js'
import { CommandNotFoundError } from '../Errors/Errors.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

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
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    error,
  }
}

export const getResponse = async (message) => {
  try {
    const result = await Command.execute(message.method, ...message.params)
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      result,
    }
  } catch (error) {
    return getErrorResponse(message, error)
  }
}
