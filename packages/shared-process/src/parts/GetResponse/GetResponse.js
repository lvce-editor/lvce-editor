import * as Command from '../Command/Command.js'
import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as RequiresSocket from '../RequiresSocket/RequiresSocket.js'

const shouldLogError = (error) => {
  if (error && error.code === ErrorCodes.ENOENT) {
    return false
  }
  return true
}

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
    if (!shouldLogError(error)) {
      return {
        jsonrpc: JsonRpcVersion.Two,
        id: message.id,
        error: {
          code: JsonRpcErrorCode.Custom,
          message: `${error}`,
          data: {
            code: error.code,
          },
        },
      }
    }
    const prettyError = PrettyError.prepare(error)
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
    const fullStack = prettyError.type + ': ' + prettyError.message + '\n' + prettyError.stack
    return {
      jsonrpc: JsonRpcVersion.Two,
      id: message.id,
      error: {
        code: JsonRpcErrorCode.Custom,
        message: prettyError.message,
        data: {
          stack: fullStack,
          codeFrame: prettyError.codeFrame,
          type: prettyError.type,
        },
      },
    }
  }
}
