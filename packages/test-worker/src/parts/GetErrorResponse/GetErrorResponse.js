import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'

export const getErrorResponse = async (message, error) => {
  if (error && error instanceof Error && error.message && error.message.startsWith('method not found')) {
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
  const prettyError = await PrettyError.prepare(error)
  PrintPrettyError.printPrettyError(prettyError, `[extension-host-sub-worker] `)
  return {
    jsonrpc: JsonRpcVersion.Two,
    id: message.id,
    error: {
      code: JsonRpcErrorCode.Custom,
      message: prettyError.message,
      data: {
        stack: prettyError.stack,
        codeFrame: prettyError.codeFrame,
        type: prettyError.type,
      },
    },
  }
}
