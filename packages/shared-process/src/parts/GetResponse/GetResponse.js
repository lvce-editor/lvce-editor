import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import { requiresSocket } from '../RequiresSocket/RequiresSocket.js'

export const getResponse = async (message, handle) => {
  try {
    const result = requiresSocket(message.method)
      ? await Command.invoke(message.method, handle, ...message.params)
      : await Command.invoke(message.method, ...message.params)

    return {
      jsonrpc: JsonRpc.Version,
      id: message.id,
      result: result ?? null,
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
    // @ts-ignore
    if (error && error instanceof Error && error.code === ErrorCodes.ENOENT) {
      return {
        jsonrpc: JsonRpc.Version,
        id: message.id,
        error: {
          code: -32001,
          message: `${error}`,
        },
      }
    }
    const prettyError = PrettyError.prepare(error)
    PrettyError.print(prettyError, `[shared-process] `)
    return {
      jsonrpc: JsonRpc.Version,
      id: message.id,
      error: {
        code: -32001,
        message: prettyError.message,
        data: {
          stack: prettyError.stack,
          codeFrame: prettyError.codeFrame,
        },
      },
    }
  }
}
