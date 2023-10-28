import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcErrorResponse from '../JsonRpcErrorResponse/JsonRpcErrorResponse.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'
import * as ShouldLogError from '../ShouldLogError/ShouldLogError.js'

const getErrorProperty = (error, prettyError) => {
  if (error && error instanceof CommandNotFoundError) {
    return {
      code: JsonRpcErrorCode.MethodNotFound,
      message: error.message,
      data: error.stack,
    }
  }
  if (!ShouldLogError.shouldLogError(error)) {
    return {
      code: JsonRpcErrorCode.Custom,
      message: `${error}`,
      data: {
        stack: prettyError.stack,
        codeFrame: prettyError.codeFrame,
        type: prettyError.type,
        code: prettyError.code,
      },
    }
  }
  return {
    code: JsonRpcErrorCode.Custom,
    message: prettyError.message,
    data: {
      stack: prettyError.stack,
      codeFrame: prettyError.codeFrame,
      type: prettyError.type,
      code: prettyError.code,
    },
  }
}

export const getErrorResponse = (message, error, ipc) => {
  const prettyError = PrettyError.prepare(error)
  if (ShouldLogError.shouldLogError(error)) {
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
  }
  const errorProperty = getErrorProperty(error, prettyError)
  return JsonRpcErrorResponse.create(message, errorProperty)
}
