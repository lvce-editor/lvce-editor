import * as Character from '../Character/Character.ts'
import * as GetErrorConstructor from '../GetErrorConstructor/GetErrorConstructor.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const constructError = (message: string, type: string, name: string) => {
  const ErrorConstructor = GetErrorConstructor.getErrorConstructor(message, type)
  if (ErrorConstructor === DOMException && name) {
    return new ErrorConstructor(message, name)
  }
  if (ErrorConstructor === Error) {
    const error = new Error(message)
    if (name && name !== 'VError') {
      error.name = name
    }
    return error
  }
  return new ErrorConstructor(message)
}

const recreateStack = (message: string, stack: string) => {
  if (message && !stack.includes(message)) {
    return message + Character.NewLine + stack
  }
  return stack
}

const getErrorType = (error: any) => {
  if (error && error.type) {
    return error.type
  }
  if (error && error.data && error.data.type) {
    return error.data.type
  }
  return ''
}

export const restoreJsonRpcError = (error: any) => {
  if (error && error instanceof Error) {
    return error
  }
  if (error && error.code && error.code === JsonRpcErrorCode.MethodNotFound) {
    const restoredError = new JsonRpcError(error.message)
    restoredError.stack = error.stack || error.data || ''
    return restoredError
  }
  if (error && error.message) {
    const type = getErrorType(error)
    const restoredError = constructError(error.message, type, error.name)
    const currentStack = JoinLines.joinLines(SplitLines.splitLines(new Error().stack).slice(1))
    if (error.data) {
      if (error.data.stack && type && error.message) {
        restoredError.stack = type + ': ' + error.message + Character.NewLine + error.data.stack + Character.NewLine + currentStack
      } else if (error.data.stack) {
        restoredError.stack = recreateStack(error.message, error.data.stack) + Character.NewLine + currentStack
      }
      if (error.data.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.data.codeFrame
      }
      if (error.data.code) {
        // @ts-ignore
        restoredError.code = error.data.code
      }
    } else if (error.stack) {
      // @ts-ignore
      restoredError.stack = recreateStack(error.message, error.stack) + Character.NewLine + currentStack
    }
    return restoredError
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`)
  }
  console.log({ error })
  return new Error(`JsonRpc Error: Unknown Error`)
}
