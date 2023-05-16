const { CommandNotFoundError } = require('../CommandNotFoundError/CommandNotFoundError.js')
const JsonRpcErrorCode = require('../JsonRpcErrorCode/JsonRpcErrorCode.js')
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
        code: JsonRpcErrorCode.MethodNotFound,
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
