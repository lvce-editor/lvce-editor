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
    const restoredError = new Error(error.message)
    if (error.data) {
      if (error.data.stack) {
        restoredError.stack = error.data.stack
      }
      if (error.data.codeFrame) {
        // @ts-ignore
        restoredError.codeFrame = error.data.codeFrame
      }
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
