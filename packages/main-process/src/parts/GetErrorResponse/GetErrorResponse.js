const { CommandNotFoundError } = require('../CommandNotFoundError/CommandNotFoundError.js')
const JsonRpc = require('../JsonRpc/JsonRpc.js')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.js')
const PrettyError = require('../PrettyError/PrettyError.js')

exports.getErrorResponse = async (message, error) => {
  const prettyError = await PrettyError.prepare(error)
  PrettyError.print(prettyError)
  if (error && error instanceof CommandNotFoundError) {
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
  return {
    jsonrpc: JsonRpcVersion.Two,
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
