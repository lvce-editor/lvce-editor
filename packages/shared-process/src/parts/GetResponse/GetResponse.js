import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

export const getResponse = async (message, handle) => {
  try {
    const result = RequiresSocket.requiresSocket(message.method)
      ? await Command.execute(message.method, handle, ...message.params)
      : await Command.execute(message.method, ...message.params)
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      result: result ?? null,
    }
  } catch (error) {
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
    // @ts-ignore
    if (error && error instanceof Error && error.code === ErrorCodes.ENOENT) {
      return {
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        error: {
          code: JsonRpcErrorCode.Custom,
          message: `${error}`,
        },
      }
    }
    const prettyError = PrettyError.prepare(error)
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      error: {
        code: JsonRpcErrorCode.Custom,
        message: prettyError.message,
        data: {
          stack: prettyError.stack,
          codeFrame: prettyError.codeFrame,
        },
      },
    }
  }
}
