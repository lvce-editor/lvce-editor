import { JsonRpcError } from '../Errors/Errors.js'
import * as ErrorType from '../ErrorType/ErrorType.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'

const getErrorConstructor = (message, type) => {
  if (type) {
    switch (type) {
      case ErrorType.DomException:
        return DOMException
      case ErrorType.TypeError:
        return TypeError
      case ErrorType.SyntaxError:
        return SyntaxError
      case ErrorType.ReferenceError:
        return ReferenceError
      default:
        return Error
    }
  }
  if (message.startsWith('TypeError: ')) {
    return TypeError
  }
  if (message.startsWith('SyntaxError: ')) {
    return SyntaxError
  }
  if (message.startsWith('ReferenceError: ')) {
    return ReferenceError
  }
  return Error
}

const constructError = (message, type, name) => {
  const ErrorConstructor = getErrorConstructor(message, type)
  if (ErrorConstructor === DOMException && name) {
    return new ErrorConstructor(message, name)
  }
  if (ErrorConstructor === Error) {
    return new Error(message)
  }
  return new ErrorConstructor(message)
}

export const restoreJsonRpcError = (error) => {
  if (error && error instanceof Error) {
    return error
  }
  if (error && error.code && error.code === JsonRpcErrorCode.MethodNotFound) {
    const restoredError = new JsonRpcError(error.message)
    restoredError.stack = error.stack
    return restoredError
  }
  if (error && error.message) {
    const restoredError = constructError(error.message, error.type, error.name)
    if (error.data) {
      if (error.data.stack) {
        restoredError.stack = error.data.stack

        if (error.data.codeFrame) {
          // @ts-ignore
          restoredError.codeFrame = error.data.codeFrame
        }
      }
    } else if (restoredError.stack) {
      // TODO accessing stack might be slow
      const lowerStack = restoredError.stack
      // @ts-ignore
      const indexNewLine = lowerStack.indexOf('\n')
      // @ts-ignore
      restoredError.stack = error.stack + lowerStack.slice(indexNewLine)
    }
    return restoredError
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`)
  }
  return new Error(`JsonRpc Error: ${error}`)
}
