const GetErrorConstructor = require('../GetErrorConstructor/GetErrorConstructor.js')
const GetNewLineIndex = require('../GetNewLineIndex/GetNewLineIndex.js')
const JoinLines = require('../JoinLines/JoinLines.js')
const { JsonRpcError } = require('../JsonRpcError/JsonRpcError.js')
const JsonRpcErrorCode = require('../JsonRpcErrorCode/JsonRpcErrorCode.js')
const SplitLines = require('../SplitLines/SplitLines.js')
const Character = require('../Character/Character.js')

const constructError = (message, type, name) => {
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

exports.restoreJsonRpcError = (error) => {
  if (error && error instanceof Error) {
    return error
  }
  const currentStack = JoinLines.joinLines(SplitLines.splitLines(new Error().stack).slice(1))
  if (error && error.code && error.code === JsonRpcErrorCode.MethodNotFound) {
    const restoredError = new JsonRpcError(error.message)
    restoredError.stack = (error.stack || error.data || '') + Character.NewLine + currentStack
    return restoredError
  }
  if (error && error.message) {
    const restoredError = constructError(error.message, error.type, error.name)
    if (error.data) {
      if (error.data.stack && error.data.type && error.message) {
        restoredError.stack = error.data.type + ': ' + error.message + Character.NewLine + error.data.stack + Character.NewLine + currentStack
      } else if (error.data.stack) {
        restoredError.stack = error.data.stack
      }
      if (error.data.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.data.codeFrame
      }
      if (error.data.code) {
        // @ts-ignore
        restoredError.code = error.data.code
      }
    } else {
      if (error.stack) {
        // TODO accessing stack might be slow
        const lowerStack = restoredError.stack || ''
        // @ts-ignore
        const indexNewLine = GetNewLineIndex.getNewLineIndex(lowerStack)
        // @ts-ignore
        restoredError.stack = error.stack + lowerStack.slice(indexNewLine)
      }
      if (error.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.codeFrame
      }
    }
    return restoredError
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`)
  }
  return new Error(`JsonRpc Error: ${error}`)
}
