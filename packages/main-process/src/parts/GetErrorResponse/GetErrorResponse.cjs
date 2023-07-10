const { CommandNotFoundError } = require('../CommandNotFoundError/CommandNotFoundError.cjs')
const JsonRpcErrorCode = require('../JsonRpcErrorCode/JsonRpcErrorCode.cjs')
const JsonRpcVersion = require('../JsonRpcVersion/JsonRpcVersion.cjs')
const PrettyError = require('../PrettyError/PrettyError.cjs')
const PrintPrettyError = require('../PrintPrettyError/PrintPrettyError.cjs')

exports.getErrorResponse = async (message, error) => {
  const prettyError = await PrettyError.prepare(error)
  PrintPrettyError.printPrettyError(prettyError, '[main-process] ')
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
