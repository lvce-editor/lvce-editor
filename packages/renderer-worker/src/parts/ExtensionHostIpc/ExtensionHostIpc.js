import * as Callback from '../Callback/Callback.js'
import { JsonRpcError } from '../Errors/Errors.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const Methods = {
  SharedProcess: 1,
  ModuleWebWorker: 2,
  WebSocket: 3,
  Messageport: 4,
  ReferencePort: 5,
}

const getModule = (method) => {
  switch (method) {
    case Methods.SharedProcess:
      return import('./ExtensionHostIpcWithSharedProcess.js')
    case Methods.ModuleWebWorker:
      return import('./ExtensionHostIpcWithModuleWorker.js')
    case Methods.WebSocket:
      return import('./ExtensionHostIpcWithWebSocket.js')
    case Methods.ReferencePort:
      return import('./ExtensionHostIpcWithReferencePort.js')
    case Methods.Messageport:
      return import('./ExtensionHostIpcWithMessagePort.js')
    default:
      throw new Error(`unexpected extension host type: ${method}`)
  }
}

const isResultMessage = (message) => {
  return 'result' in message
}

const isErrorMessage = (message) => {
  return 'error' in message
}

const restoreError = (error) => {
  if (error instanceof Error) {
    return error
  }
  if (error.code && error.code === -32601) {
    console.log('create json rpc error')
    const restoredError = new JsonRpcError(error.message)
    restoredError.stack = error.stack
    return restoredError
  }
  const restoredError = new Error(error.message)
  if (error.data.stack) {
    restoredError.stack = error.data.stack
  }
  if (error.data.codeFrame) {
    // @ts-ignore
    restoredError.codeFrame = error.data.codeFrame
  }
  return restoredError
}

const handleMessage = (message) => {
  if (message.id) {
    if (isResultMessage(message)) {
      Callback.resolve(message.id, message.result)
    } else if (isErrorMessage(message)) {
      const restoredError = restoreError(message.error)
      Callback.reject(message.id, restoredError)
    } else {
      throw new JsonRpcError('unexpected message type')
    }
  } else {
    throw new JsonRpcError('unexpected message type')
  }
}

export const listen = async (method) => {
  const module = await getModule(method)
  const ipc = await module.create()
  // TODO maybe pass handleMessage as paramter to make code more functional
  ipc.onmessage = handleMessage
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
