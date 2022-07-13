import * as ExtensionHostIpcWithSharedProcess from './ExtensionHostIpcWithSharedProcess.js'
import * as ExtensionHostIpcWithWebWorker from './ExtensionHostIpcWithWebWorker.js'
import * as Callback from '../Callback/Callback.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { JsonRpcError } from '../Errors/Errors.js'

export const Methods = {
  SharedProcess: 1,
  WebWorker: 2,
}

const getIpc = (method) => {
  switch (method) {
    case Methods.SharedProcess:
      return ExtensionHostIpcWithSharedProcess.listen()
    case Methods.WebWorker:
      return ExtensionHostIpcWithWebWorker.listen()
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
  restoredError.stack = error.stack
  return restoredError
}

const handleMessage = (event) => {
  const message = event.data
  if (message.id) {
    if (isResultMessage(message)) {
      Callback.resolve(message.id, message.result)
    } else if (isErrorMessage(message)) {
      const restoredError = restoreError(message.error)
      console.log({ restoredError })
      Callback.reject(message.id, restoredError)
    } else {
      throw new JsonRpcError('unexpected message type')
    }
  } else {
    throw new JsonRpcError('unexpected message type')
  }
}

export const listen = async (method) => {
  const ipc = await getIpc(method)
  ipc.onmessage = handleMessage
  return {
    invoke(method, ...params) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
