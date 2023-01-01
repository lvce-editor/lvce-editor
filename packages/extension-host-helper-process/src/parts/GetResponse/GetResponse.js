import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as PrettyError from '../PrettyError/PrettyError.js'

export const getResponse = async (message) => {
  try {
    const result = await Command.invoke(message.method, ...message.params)
    return {
      jsonrpc: JsonRpc.Version,
      id: message.id,
      result,
    }
  } catch (error) {
    if (error && error instanceof Error && error.message && error.message.startsWith('method not found')) {
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
    const prettyError = PrettyError.prepare(error)
    return {
      jsonrpc: JsonRpc.Version,
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
}
