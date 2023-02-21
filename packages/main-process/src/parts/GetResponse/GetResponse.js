const Command = require('../Command/Command.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')
const PrettyError = require('../PrettyError/PrettyError.js')

exports.getResponse = async (message) => {
  try {
    const result = await Command.invoke(message.method, ...message.params)
    return {
      jsonrpc: JsonRpc.Version,
      result,
      id: message.id,
    }
  } catch (error) {
    const prettyError = await PrettyError.prepare(error)
    PrettyError.print(prettyError)
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
    return {
      jsonrpc: JsonRpc.Version,
      id: message.id,
      error: {
        // TODO actually check that error.message and error.stack exist
        // @ts-ignore
        message: prettyError.message,
        data: {
          // @ts-ignore
          stack: prettyError.stack,
          codeFrame: prettyError.codeFrame,
        },
      },
    }
  }
}
