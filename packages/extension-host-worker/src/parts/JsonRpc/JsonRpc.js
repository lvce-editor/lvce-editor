import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const send = (transport, method, ...params) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params: params,
  })
}

const getErrorConstructor = (message, type) => {
  if (type) {
    switch (type) {
      case 'DomException':
        return DOMException
      case 'TypeError':
        return TypeError
      case 'SyntaxError':
        return SyntaxError
      case 'ReferenceError':
        return ReferenceError
      case 'DOMException':
        return DOMException
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
  const shortMessage = message.slice(ErrorConstructor.name.length + 2)
  return new ErrorConstructor(shortMessage)
}

const restoreError = (error) => {
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
  if (error && error.shortMessage && typeof error.shortMessage === 'string') {
    return new Error(error.shortMessage)
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`)
  }
  return new Error(`JsonRpc Error: ${error}`)
}

export const invoke = async (ipc, method, ...params) => {
  const responseMessage = await new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    ipc.send({
      jsonrpc: JsonRpcVersion.Two,
      method,
      params,
      id: callbackId,
    })
  })
  if ('error' in responseMessage) {
    const restoredError = restoreError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }

  throw new Error('unexpected response message')
}

export const handleMessage = (message) => {
  if ('id' in message) {
    if ('method' in message) {
      throw new Error('not implemented')
    }
    Callback.resolve(message.id, message)
    return
  }
}
