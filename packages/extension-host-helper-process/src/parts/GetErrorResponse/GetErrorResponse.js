import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

export const getErrorResponse = (message, error) => {
  if (error && error instanceof Error && error.message && error.message.startsWith('method not found')) {
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      error: {
        code: JsonRpc.ErrorMethodNotFound,
        message: error.message,
        data: error.stack,
      },
    }
  }
  const prettyError = PrettyError.prepare(error)
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    error: {
      code: -32001,
      message: prettyError.message,
      data: {
        stack: prettyError.stack,
        codeFrame: prettyError.codeFrame,
        code: prettyError.code,
      },
    },
  }
}
