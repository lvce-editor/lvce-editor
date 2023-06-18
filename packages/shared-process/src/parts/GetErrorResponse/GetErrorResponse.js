import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcErrorResponse from '../JsonRpcErrorResponse/JsonRpcErrorResponse.js'
import * as PrettyError from '../PrettyError/PrettyError.js'
import * as PrintPrettyError from '../PrintPrettyError/PrintPrettyError.js'

const shouldLogError = (error) => {
  if (error && error.code === ErrorCodes.ENOENT) {
    return false
  }
  return true
}

const getErrorProperty = (error, prettyError) => {
  if (error && error instanceof CommandNotFoundError) {
    return {
      code: JsonRpcErrorCode.MethodNotFound,
      message: error.message,
      data: error.stack,
    }
  }
  if (!shouldLogError(error)) {
    return {
      code: JsonRpcErrorCode.Custom,
      message: `${error}`,
      data: {
        code: error.code,
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
  if (shouldLogError(error)) {
    PrintPrettyError.printPrettyError(prettyError, `[shared-process] `)
  }
  const errorProperty = getErrorProperty(error, prettyError)
  return JsonRpcErrorResponse.create(message, errorProperty)
}
