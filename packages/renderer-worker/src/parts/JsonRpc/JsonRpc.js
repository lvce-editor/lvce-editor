import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as JsonRpcErrorCode from '../JsonRpcErrorCode/JsonRpcErrorCode.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const send = (transport, method, ...parameters) => {
  transport.send({
    jsonrpc: JsonRpcVersion.Two,
    method,
    params: parameters,
  })
}

const constructError = (message) => {
  if (message.startsWith('Error: ')) {
    return new Error(message.slice('Error: '.length))
  }
  if (message.startsWith('TypeError: ')) {
    return new TypeError(message.slice('TypeError: '.length))
  }
  if (message.startsWith('SyntaxError: ')) {
    return new SyntaxError(message.slice('SyntaxError: '.length))
  }
  if (message.startsWith('ReferenceError: ')) {
    return new ReferenceError(message.slice('ReferenceError: '.length))
  }
  return new Error(message)
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
  console.log({ error })
  if (error && error.message) {
    const restoredError = constructError(error.message)
    if (error.data) {
      if (error.data.stack) {
        restoredError.stack = error.data.stack

        if (error.data.codeFrame) {
          // @ts-ignore
          restoredError.codeFrame = error.data.codeFrame
        }
      }
    } else if (error.stack) {
      console.log('set stack')
      // restoredError.stack = error.stack
      Error.captureStackTrace(invoke)
    }
    return restoredError
  }
  if (typeof error === 'string') {
    return new Error(`JsonRpc Error: ${error}`)
  }
  return new Error(`JsonRpc Error: ${error}`)
}

export const invoke = async (transport, method, ...parameters) => {
  const responseMessage = await new Promise((resolve, reject) => {
    // TODO use one map instead of two
    const callbackId = Callback.register(resolve, reject)
    transport.send({
      jsonrpc: JsonRpcVersion.Two,
      method,
      params: parameters,
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
