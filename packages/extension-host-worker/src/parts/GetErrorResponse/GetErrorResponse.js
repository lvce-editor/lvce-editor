import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

class NonError extends Error {
  name = 'NonError'

  constructor(message) {
    super(message)
  }
}

// ensureError based on https://github.com/sindresorhus/ensure-error/blob/main/index.js (License MIT)
const ensureError = (input) => {
  if (!(input instanceof Error)) {
    return new NonError(input)
  }
  return input
}

const serializeError = (error) => {
  error = ensureError(error)
  return {
    stack: error.stack,
    message: error.message,
    name: error.name,
    type: error.constructor.name,
  }
}

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
  const serializedError = serializeError(error)
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
